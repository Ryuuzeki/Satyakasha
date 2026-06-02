import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { verifySignatureKey, isPaymentConfirmed } from '../lib/midtrans.js';
import { webhookLogger } from '../lib/logger.js';
import { executeBlockchainTx, executeBuybackTx } from './bridge.service.js';
import type { MidtransNotification } from '../types/index.js';

interface TransactionRow {
  id: string;
  order_id: string;
  status: string;
  gross_amount: any;
}

export async function handleMidtransWebhook(notification: MidtransNotification): Promise<void> {
  const isValid = verifySignatureKey(notification);
  if (!isValid) {
    throw new WebhookError('Invalid signature key', 403);
  }

  const orderId = notification.order_id;
  const log = webhookLogger.child({ orderId });
  log.info({ status: notification.transaction_status, fraud: notification.fraud_status }, 'Received webhook notification');

  let shouldTriggerBlockchain = false;
  let fiatAmountRupiah = 0;

  await prisma.$transaction(
    async (tx) => {
      const rows = await tx.$queryRaw<TransactionRow[]>`
        SELECT id, order_id, status, gross_amount FROM "transactions" WHERE "order_id" = ${orderId} FOR UPDATE
      `;
      const row = rows[0];

      if (!row) {
        log.error('Transaction not found in database');
        throw new WebhookError(`Transaction ${orderId} not found`, 404);
      }

      if (row.status !== 'PENDING') {
        log.warn({ currentStatus: row.status }, 'Duplicate webhook detected — ignoring (idempotency guard)');
        return;
      }

      const isConfirmed = isPaymentConfirmed(notification.transaction_status, notification.fraud_status);

      if (isConfirmed) {
        await tx.$executeRaw`
          UPDATE "transactions"
          SET "status" = 'PAID_FIAT'::"TransactionStatus", "payment_type" = ${notification.payment_type}, "midtrans_status" = ${notification.transaction_status}, "paid_at" = NOW(), "updated_at" = NOW()
          WHERE "order_id" = ${orderId}
        `;
        log.info('✅ Payment confirmed — status updated to PAID_FIAT');
        shouldTriggerBlockchain = true;
        fiatAmountRupiah = Number(row.gross_amount);
      }
    },
    { maxWait: 10000, timeout: 30000, isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  if (shouldTriggerBlockchain) {
    // 1. Eksekusi Blockchain untuk Mendaftarkan Dokumen (Anchoring)
    executeBlockchainTx(orderId).catch((error) => {
      log.error({ error: error instanceof Error ? error.message : error }, 'Unhandled error in blockchain execution');
    });

    // 2. Eksekusi Mekanisme Buyback Token untuk Ekonomi Sirkular DePIN
    if (fiatAmountRupiah > 0) {
      executeBuybackTx(fiatAmountRupiah).catch((error) => {
        log.error({ error: error instanceof Error ? error.message : error }, 'Unhandled error in buyback execution');
      });
    }
  }
}

export class WebhookError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'WebhookError';
    this.statusCode = statusCode;
  }
}
