// =============================================================================
// Reconciliation Service — Stuck Transaction Recovery
// =============================================================================
// The "Auditor": finds transactions stuck in PAID_FIAT or BLOCKCHAIN_PROCESSING
// for longer than the threshold (default: 10 minutes) and re-triggers them.
// =============================================================================

import { prisma } from '../lib/prisma.js';
import { provider } from '../lib/blockchain.js';
import { reconciliationLogger as log } from '../lib/logger.js';
import { executeBlockchainTx } from './bridge.service.js';
import type { ReconciliationResult } from '../types/index.js';

/** Default threshold: 10 minutes */
const STUCK_THRESHOLD_MS = 10 * 60 * 1000;

/**
 * Scans for and recovers stuck transactions.
 *
 * Cases handled:
 * 1. BLOCKCHAIN_PROCESSING with txHash → Check on-chain receipt
 *    - If confirmed → update to SUCCESS (crash recovery)
 *    - If not confirmed → re-trigger execution
 * 2. PAID_FIAT with no txHash → Blockchain never attempted → re-trigger
 * 3. BLOCKCHAIN_PROCESSING with no txHash → Submission crashed → re-trigger
 *
 * @param thresholdMs - Time in ms after which a transaction is "stuck"
 * @returns Summary of reconciliation actions taken
 */
export async function reconcileStuckTransactions(
  thresholdMs: number = STUCK_THRESHOLD_MS
): Promise<ReconciliationResult> {
  const cutoffTime = new Date(Date.now() - thresholdMs);

  log.info(
    { cutoffTime: cutoffTime.toISOString(), thresholdMs },
    'Starting reconciliation scan...'
  );

  // Find all stuck transactions
  const stuckTransactions = await prisma.transaction.findMany({
    where: {
      status: { in: ['PAID_FIAT', 'BLOCKCHAIN_PROCESSING'] },
      updatedAt: { lt: cutoffTime },
    },
    orderBy: { updatedAt: 'asc' },
  });

  const result: ReconciliationResult = {
    totalStuck: stuckTransactions.length,
    recovered: 0,
    retriggered: 0,
    failed: 0,
    details: [],
  };

  if (stuckTransactions.length === 0) {
    log.info('No stuck transactions found — all clear ✅');
    return result;
  }

  log.warn(
    { count: stuckTransactions.length },
    '⚠️  Found stuck transactions — processing...'
  );

  for (const tx of stuckTransactions) {
    const txLog = log.child({ orderId: tx.orderId, status: tx.status });

    try {
      // Case 1: Has a txHash — check if it actually confirmed on-chain
      if (tx.status === 'BLOCKCHAIN_PROCESSING' && tx.txHash) {
        txLog.info({ txHash: tx.txHash }, 'Checking on-chain receipt...');

        const receipt = await provider.getTransactionReceipt(tx.txHash);

        if (receipt && receipt.status === 1) {
          // Transaction DID confirm — DB just wasn't updated (crash recovery)
          await prisma.transaction.update({
            where: { orderId: tx.orderId },
            data: {
              status: 'SUCCESS',
              blockNumber: receipt.blockNumber,
              completedAt: new Date(),
              lastError: null,
            },
          });

          txLog.info(
            { blockNumber: receipt.blockNumber },
            '✅ Recovered: tx was confirmed on-chain but DB missed the update'
          );

          result.recovered++;
          result.details.push({
            orderId: tx.orderId,
            previousStatus: tx.status,
            action: 'recovered',
          });
          continue;
        }
      }

      // Case 2 & 3: No confirmation — re-trigger blockchain execution
      txLog.info('Re-triggering blockchain execution...');

      // Reset to PAID_FIAT so the bridge can re-enter
      await prisma.transaction.update({
        where: { orderId: tx.orderId },
        data: { status: 'PAID_FIAT' },
      });

      await executeBlockchainTx(tx.orderId, tx.retryCount);

      result.retriggered++;
      result.details.push({
        orderId: tx.orderId,
        previousStatus: tx.status,
        action: 'retriggered',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      txLog.error({ error: errorMsg }, 'Failed to reconcile transaction');

      result.failed++;
      result.details.push({
        orderId: tx.orderId,
        previousStatus: tx.status,
        action: 'failed',
        error: errorMsg,
      });
    }
  }

  log.info(
    {
      totalStuck: result.totalStuck,
      recovered: result.recovered,
      retriggered: result.retriggered,
      failed: result.failed,
    },
    'Reconciliation scan complete'
  );

  return result;
}
