'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { isSessionExpired } from '@/lib/api';

// Root-level fallback -- app/dashboard/error.tsx handles the main
// authenticated area more specifically; this just makes sure nothing in
// the admin app ever shows Next.js's raw default crash screen to whoever
// is using it.
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[error-boundary:root]', error);
  }, [error]);

  if (isSessionExpired(error)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">Your session has expired</h1>
        <p className="max-w-sm text-sm muted">
          Admin sessions are only valid for 7 days. Log in again to continue.
        </p>
        <Link href="/login" className="btn-primary">
          Log in again
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm muted">
        Please try again. If this keeps happening, check the server logs.
      </p>
      <button type="button" onClick={() => reset()} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
