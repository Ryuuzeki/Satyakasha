// =============================================================================
// Prisma Client Singleton
// =============================================================================
// Ensures a single Prisma Client instance is reused across the application.
// Prevents connection pool exhaustion during development hot-reloads.
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

// Log slow queries in development
prisma.$on('query' as never, (e: { duration: number; query: string }) => {
  if (e.duration > 500) {
    logger.warn(
      { duration: e.duration, query: e.query },
      'Slow database query detected'
    );
  }
});

prisma.$on('error' as never, (e: { message: string }) => {
  logger.error({ error: e.message }, 'Prisma client error');
});

// Prevent multiple instances during hot-reload in development
if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
