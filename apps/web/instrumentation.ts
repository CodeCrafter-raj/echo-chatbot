import * as Sentry from '@sentry/nextjs';

/**
 * Dynamically loads and applies Sentry configuration for the current Next.js runtime.
 *
 * When NEXT_RUNTIME is "nodejs", loads ./sentry.server.config; when NEXT_RUNTIME is "edge", loads ./sentry.edge.config.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;