"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

/**
 * Reports a client-side error to Sentry and renders a generic Next.js error page.
 *
 * The component sends the provided `error` to Sentry for reporting and returns
 * a minimal HTML structure containing Next.js's default error page. Because
 * the App Router does not expose HTTP status codes for errors, the default
 * error component is rendered with `statusCode={0}` to show a generic message.
 *
 * @param error - The error to report and display; may include an optional `digest` property
 * @returns A React element that displays a generic error page
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}