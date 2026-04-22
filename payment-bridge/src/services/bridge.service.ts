// =============================================================================
// Bridge Service — Automated Crypto Execution + Exponential Backoff
// =============================================================================

import { ethers } from 'ethers';
import { prisma } from '../lib/prisma.js';
import {
  registryContract,
  provider,
  relayerWallet,
  getDynamicGasOverrides,
} from '../lib/blockchain.js';
import { bridgeLogger } from '../lib/logger.js';
import { DEFAULT_RETRY_CONFIG } from '../types/index.js';
import type { RetryConfig } from '../types/index.js';

/**
 * Executes a blockchain transaction to register a document on Lisk L2.
 * Implements exponential backoff retry on failure.
 */
export async function executeBlockchainTx(
  orderId: string,
  attempt: number = 0,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<void> {
  const log = bridgeLogger.child({ orderId, attempt });
  log.info('Starting blockchain execution');

  // Step 1: Fetch transaction
  const transaction = await prisma.transaction.findUnique({
    where: { orderId },
  });

  if (!transaction) {
    log.error('Transaction not found — cannot execute');
    return;
  }

  // Step 2: Status guard
  if (transaction.status !== 'PAID_FIAT' && transaction.status !== 'BLOCKCHAIN_PROCESSING') {
    log.warn({ currentStatus: transaction.status }, 'Not in executable state — skipping');
    return;
  }

  // Step 3: Mark BLOCKCHAIN_PROCESSING
  if (transaction.status === 'PAID_FIAT') {
    await prisma.transaction.update({
      where: { orderId },
      data: { status: 'BLOCKCHAIN_PROCESSING', processedAt: new Date() },
    });
    log.info('Status updated to BLOCKCHAIN_PROCESSING');
  }

  try {
    // Step 4: Dynamic gas estimation
    log.info('Estimating gas for registerDocument()...');
    const registerFn = registryContract.getFunction('registerDocument');
    const estimatedGas = await registerFn.estimateGas(
      transaction.documentHash,
      transaction.ipfsCid,
      transaction.institutionName,
      transaction.recipientName
    );
    log.info({ estimatedGas: estimatedGas.toString() }, 'Gas estimate received');

    const gasOverrides = await getDynamicGasOverrides(estimatedGas);

    // Step 5: Get proper nonce
    const nonce = await provider.getTransactionCount(relayerWallet.address, 'pending');
    log.info({ nonce }, 'Using nonce for transaction');

    // Step 6: Submit transaction
    log.info({
      documentHash: transaction.documentHash.substring(0, 16) + '...',
      institution: transaction.institutionName,
    }, 'Submitting registerDocument() transaction...');

    const txResponse: ethers.TransactionResponse = await registerFn(
      transaction.documentHash,
      transaction.ipfsCid,
      transaction.institutionName,
      transaction.recipientName,
      {
        maxFeePerGas: gasOverrides.maxFeePerGas,
        maxPriorityFeePerGas: gasOverrides.maxPriorityFeePerGas,
        gasLimit: gasOverrides.gasLimit,
        nonce,
      }
    );

    log.info({ txHash: txResponse.hash }, '📡 Transaction submitted — waiting for confirmation...');

    // Step 7: Wait for confirmation (1 block)
    const receipt = await txResponse.wait(1);
    if (!receipt || receipt.status !== 1) {
      throw new Error(`Transaction reverted on-chain. Hash: ${txResponse.hash}`);
    }

    log.info({
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    }, '✅ Transaction confirmed on Lisk Sepolia!');

    // Step 8: Update DB → SUCCESS
    await prisma.transaction.update({
      where: { orderId },
      data: {
        status: 'SUCCESS',
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        completedAt: new Date(),
        lastError: null,
      },
    });

    log.info({ txHash: receipt.hash }, '🎉 Bridge complete: PAID_FIAT → SUCCESS');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown blockchain error';
    log.error({ error: errorMessage, attempt, maxRetries: config.maxRetries }, 'Blockchain execution failed');

    // Step 9: Exponential Backoff Retry
    if (attempt < config.maxRetries) {
      const delay = calculateBackoffDelay(attempt, config);
      log.warn({ nextAttempt: attempt + 1, delayMs: delay }, `Scheduling retry in ${delay}ms...`);

      await prisma.transaction.update({
        where: { orderId },
        data: {
          retryCount: attempt + 1,
          lastError: errorMessage,
          status: 'PAID_FIAT', // Reset so retry can re-enter
        },
      });

      setTimeout(() => {
        executeBlockchainTx(orderId, attempt + 1, config).catch((retryError: unknown) => {
          bridgeLogger.error({
            orderId,
            error: retryError instanceof Error ? retryError.message : retryError,
          }, 'Unhandled error in retry');
        });
      }, delay);
    } else {
      // Step 10: Max retries exhausted → FAILED
      log.error({ totalAttempts: attempt + 1 },
        '🚨 CRITICAL: Max retries exhausted — marking FAILED');

      await prisma.transaction.update({
        where: { orderId },
        data: {
          status: 'FAILED',
          retryCount: attempt + 1,
          lastError: `Max retries (${config.maxRetries}) exhausted. Last: ${errorMessage}`,
        },
      });
    }
  }
}

/** Exponential backoff with jitter: min(base * 2^attempt + jitter, max) */
function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * config.baseDelayMs * 0.5;
  return Math.min(exponentialDelay + jitter, config.maxDelayMs);
}
