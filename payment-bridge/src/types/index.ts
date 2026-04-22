import type { TransactionStatus } from '@prisma/client';

export interface MidtransNotification {
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  fraud_status?: string;
  currency: string;
}

export const MIDTRANS_SETTLEMENT_STATUSES = ['settlement', 'capture'] as const;

export interface CreatePaymentParams {
  documentHash: string;
  ipfsCid: string;
  institutionName: string;
  recipientName: string;
  grossAmount: number;
  customer?: { name?: string; email?: string; phone?: string; };
}

export interface CreatePaymentResponse {
  orderId: string;
  snapToken: string;
  redirectUrl: string;
}

export const VALID_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  PENDING: ['PAID_FIAT', 'FAILED'],
  PAID_FIAT: ['BLOCKCHAIN_PROCESSING', 'FAILED'],
  BLOCKCHAIN_PROCESSING: ['SUCCESS', 'FAILED', 'PAID_FIAT'],
  SUCCESS: [],
  FAILED: [],
};

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  baseDelayMs: 1000,
  maxDelayMs: 60000,
};

export interface ReconciliationResult {
  totalStuck: number;
  recovered: number;
  retriggered: number;
  failed: number;
  details: Array<{
    orderId: string;
    previousStatus: TransactionStatus;
    action: 'recovered' | 'retriggered' | 'failed';
    error?: string;
  }>;
}
