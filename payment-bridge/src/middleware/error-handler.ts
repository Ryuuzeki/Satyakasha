// =============================================================================
// Global Error Handler Middleware
// =============================================================================

import type { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

/**
 * Express global error handler.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(
    {
      error: err.message,
      stack: err.stack,
      name: err.name,
    },
    'Unhandled error caught by global error handler'
  );

  res.status(500).json({
    success: false,
    error:
      process.env['NODE_ENV'] === 'production'
        ? 'Internal server error'
        : err.message,
  });
}
