// =============================================================================
// Satyakasha Payment Bridge — Express Application Entrypoint
// =============================================================================
// This is the main entry point for the Payment Bridge microservice.
// It initializes Express, mounts routes, and handles graceful shutdown.
// =============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from './lib/prisma.js';
import { checkRelayerBalance } from './lib/blockchain.js';
import { paymentRouter } from './routes/payment.routes.js';
import { webhookRouter } from './routes/webhook.routes.js';
import { globalErrorHandler } from './middleware/error-handler.js';

// ---------------------------------------------------------------------------
// Initialize Express Application
// ---------------------------------------------------------------------------

const app = express();

// --- Security Middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.NODE_ENV === 'production'
      ? ['https://satyakasha.com'] // Lock down in production
      : '*',
    methods: ['GET', 'POST'],
  })
);

// --- Body Parsing ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Request Logging ---
app.use((req, _res, next) => {
  logger.info(
    { method: req.method, path: req.path, ip: req.ip },
    'Incoming request'
  );
  next();
});

// ---------------------------------------------------------------------------
// Mount Routes
// ---------------------------------------------------------------------------

app.use('/api/payments', paymentRouter);
app.use('/api/webhooks', webhookRouter);

// --- Health Check ---
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'satyakasha-payment-bridge',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// --- Global Error Handler (must be last) ---
app.use(globalErrorHandler);

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info('✅ Database connection established');

    // Check relayer wallet balance
    await checkRelayerBalance();

    // Start Express server
    const server = app.listen(env.PORT, () => {
      logger.info(
        { port: env.PORT, env: env.NODE_ENV },
        `🚀 Satyakasha Payment Bridge running on port ${env.PORT}`
      );
      logger.info(
        `   📌 Health:   http://localhost:${env.PORT}/health`
      );
      logger.info(
        `   📌 Payments: http://localhost:${env.PORT}/api/payments/create`
      );
      logger.info(
        `   📌 Webhook:  http://localhost:${env.PORT}/api/webhooks/midtrans`
      );
    });

    // --- Graceful Shutdown ---
    const gracefulShutdown = async (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal — cleaning up...');

      server.close(async () => {
        logger.info('HTTP server closed');
        await prisma.$disconnect();
        logger.info('Database connection closed');
        process.exit(0);
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        logger.error('Graceful shutdown timeout — forcing exit');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // --- Unhandled Rejection & Exception Handlers ---
    process.on('unhandledRejection', (reason) => {
      logger.error({ reason }, 'Unhandled Promise Rejection');
    });

    process.on('uncaughtException', (error) => {
      logger.fatal({ error: error.message, stack: error.stack }, 'Uncaught Exception — shutting down');
      process.exit(1);
    });
  } catch (error) {
    logger.fatal(
      { error: error instanceof Error ? error.message : error },
      'Failed to start Payment Bridge'
    );
    process.exit(1);
  }
}

bootstrap();
