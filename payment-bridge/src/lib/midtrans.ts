import midtransClient from 'midtrans-client';
import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { webhookLogger } from './logger.js';
import type { MidtransNotification } from '../types/index.js';

export const snap = new midtransClient.Snap({
  isProduction: env.MIDTRANS_IS_PRODUCTION,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
});

export function verifySignatureKey(notification: MidtransNotification): boolean {
  const { order_id, status_code, gross_amount, signature_key } = notification;

  if (!order_id || !status_code || !gross_amount || !signature_key) {
    webhookLogger.error('Missing required fields for signature verification');
    return false;
  }

  const payload = `${order_id}${status_code}${gross_amount}${env.MIDTRANS_SERVER_KEY}`;
  const computedSignature = crypto.createHash('sha512').update(payload).digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(signature_key)
  );

  if (!isValid) {
    webhookLogger.error(
      { order_id, computed: computedSignature, received: signature_key },
      'Signature verification failed — potential spoofing attempt'
    );
  }

  return isValid;
}

export function isPaymentConfirmed(transactionStatus: string, fraudStatus?: string): boolean {
  if (transactionStatus === 'capture') {
    return fraudStatus === 'accept';
  }
  return transactionStatus === 'settlement';
}
