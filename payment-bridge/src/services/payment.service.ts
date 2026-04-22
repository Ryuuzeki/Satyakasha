import { randomBytes } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { snap } from '../lib/midtrans.js';
import { paymentLogger } from '../lib/logger.js';
import type { CreatePaymentParams, CreatePaymentResponse } from '../types/index.js';

function generateOrderId(): string {
  const timestamp = Date.now();
  const random = randomBytes(2).toString('hex');
  return `SAT-${timestamp}-${random}`;
}

export async function createPayment(
  params: CreatePaymentParams
): Promise<CreatePaymentResponse> {
  const orderId = generateOrderId();
  const log = paymentLogger.child({ orderId });

  log.info(
    { grossAmount: params.grossAmount, institutionName: params.institutionName, documentHash: params.documentHash.substring(0, 16) + '...' },
    'Creating new payment transaction'
  );

  await prisma.transaction.create({
    data: {
      orderId,
      status: 'PENDING',
      grossAmount: params.grossAmount,
      documentHash: params.documentHash,
      ipfsCid: params.ipfsCid,
      institutionName: params.institutionName,
      recipientName: params.recipientName,
    },
  });

  try {
    const snapResponse = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: params.grossAmount },
      customer_details: {
        first_name: params.customer?.name ?? params.recipientName,
        email: params.customer?.email ?? 'customer@satyakasha.id',
        phone: params.customer?.phone,
      },
      item_details: [{
        id: 'DOC_REG',
        price: params.grossAmount,
        quantity: 1,
        name: `Document Registration: ${params.documentHash.substring(0, 8)}...`,
      }],
    });

    return {
      orderId,
      snapToken: snapResponse.token,
      redirectUrl: snapResponse.redirect_url,
    };
  } catch (error) {
    log.error({ error }, 'Failed to create Midtrans Snap token');
    await prisma.transaction.update({
      where: { orderId },
      data: { status: 'FAILED', lastError: error instanceof Error ? error.message : 'Unknown Midtrans error' },
    });
    throw error;
  }
}

export async function getPaymentStatus(orderId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { orderId },
  });
  if (!transaction) return null;
  return transaction;
}
