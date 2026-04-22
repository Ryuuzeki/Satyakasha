// =============================================================================
// Reconciliation CLI Script
// =============================================================================
// Run manually or via cron to find and recover stuck transactions.
//
// Usage:
//   npx tsx src/scripts/reconcile.ts
//   npm run reconcile
//
// Recommended cron schedule (every 5 minutes):
//   */5 * * * * cd /path/to/payment-bridge && npm run reconcile
// =============================================================================

import { reconcileStuckTransactions } from '../services/reconciliation.service.js';
import { logger } from '../lib/logger.js';
import { prisma } from '../lib/prisma.js';
import { checkRelayerBalance } from '../lib/blockchain.js';

async function main() {
  logger.info('=== Satyakasha Reconciliation Script Started ===');

  try {
    // Check wallet balance as part of reconciliation health check
    await checkRelayerBalance();

    // Run reconciliation
    const result = await reconcileStuckTransactions();

    // Print summary
    logger.info({
      totalStuck: result.totalStuck,
      recovered: result.recovered,
      retriggered: result.retriggered,
      failed: result.failed,
    }, '=== Reconciliation Summary ===');

    if (result.details.length > 0) {
      for (const detail of result.details) {
        logger.info(
          {
            orderId: detail.orderId,
            previousStatus: detail.previousStatus,
            action: detail.action,
            error: detail.error,
          },
          `  → ${detail.orderId}: ${detail.action}`
        );
      }
    }
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : error },
      'Reconciliation script failed'
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    logger.info('=== Reconciliation Script Finished ===');
  }
}

main();
