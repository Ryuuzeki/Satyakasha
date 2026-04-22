// =============================================================================
// Payment Routes — POST /api/payments/create & GET /api/payments/:orderId
// =============================================================================

import { Router } from 'express';
import type { Request, Response } from 'express';
import { createPayment, getPaymentStatus } from '../services/payment.service.js';
import { paymentLogger } from '../lib/logger.js';

export const paymentRouter = Router();

/**
 * POST /api/payments/create
 *
 * Creates a new payment transaction and returns a Midtrans Snap token.
 * The frontend uses this token to open the Midtrans payment popup.
 */
paymentRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const { documentHash, ipfsCid, institutionName, recipientName, grossAmount, customer } =
      req.body;

    // Basic validation
    if (!documentHash || !ipfsCid || !institutionName || !recipientName || !grossAmount) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: documentHash, ipfsCid, institutionName, recipientName, grossAmount',
      });
      return;
    }

    if (typeof grossAmount !== 'number' || grossAmount <= 0) {
      res.status(400).json({
        success: false,
        error: 'grossAmount must be a positive number',
      });
      return;
    }

    const result = await createPayment({
      documentHash,
      ipfsCid,
      institutionName,
      recipientName,
      grossAmount,
      customer,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    paymentLogger.error(
      { error: error instanceof Error ? error.message : error },
      'Failed to create payment'
    );

    res.status(500).json({
      success: false,
      error: 'Failed to create payment transaction',
    });
  }
});

/**
 * GET /api/payments/:orderId
 *
 * Returns the current status of a transaction.
 * Used by the frontend to poll for payment/bridge completion.
 */
paymentRouter.get('/:orderId', async (req: Request, res: Response) => {
  try {
    const orderId = req.params['orderId'];

    if (!orderId || typeof orderId !== 'string') {
      res.status(400).json({ success: false, error: 'orderId is required' });
      return;
    }

    const status = await getPaymentStatus(orderId);

    if (!status) {
      res.status(404).json({
        success: false,
        error: `Transaction ${orderId} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    paymentLogger.error(
      { error: error instanceof Error ? error.message : error },
      'Failed to fetch payment status'
    );

    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment status',
    });
  }
});
