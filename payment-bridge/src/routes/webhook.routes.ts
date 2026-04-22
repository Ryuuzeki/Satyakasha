import { Router } from 'express';
import type { Request, Response } from 'express';
import { handleMidtransWebhook, WebhookError } from '../services/webhook.service.js';
import { webhookLogger } from '../lib/logger.js';
import type { MidtransNotification } from '../types/index.js';

export const webhookRouter = Router();

webhookRouter.post('/midtrans', async (req: Request, res: Response) => {
  const notification = req.body as MidtransNotification;

  try {
    await handleMidtransWebhook(notification);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    if (error instanceof WebhookError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    webhookLogger.error({ error: error instanceof Error ? error.message : error }, 'Unhandled webhook error');
    res.status(200).json({ status: 'accepted' });
  }
});
