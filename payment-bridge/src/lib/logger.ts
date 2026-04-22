// =============================================================================
// Pino Structured Logger
// =============================================================================
// All modules use child loggers for contextual logging.
// Sensitive fields are automatically redacted in output.
// =============================================================================

import pino from 'pino';
import { env } from '../config/env.js';

export const logger = pino({
  name: 'satyakasha-bridge',
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',

  // Redact sensitive fields from ALL log output
  redact: {
    paths: [
      'privateKey',
      'private_key',
      'RELAYER_PRIVATE_KEY',
      'serverKey',
      'server_key',
      'signature_key',
      'password',
      'secret',
      'authorization',
      'req.headers.authorization',
    ],
    censor: '[REDACTED]',
  },

  // Human-readable format in development, JSON in production
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        }
      : undefined,

  // Base fields included in every log entry
  base: {
    service: 'payment-bridge',
    env: env.NODE_ENV,
  },
});

// ---------------------------------------------------------------------------
// Pre-configured child loggers for each module
// ---------------------------------------------------------------------------

export const paymentLogger = logger.child({ module: 'payment' });
export const webhookLogger = logger.child({ module: 'webhook' });
export const bridgeLogger = logger.child({ module: 'bridge' });
export const reconciliationLogger = logger.child({ module: 'reconciliation' });
export const blockchainLogger = logger.child({ module: 'blockchain' });
