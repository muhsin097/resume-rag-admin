import { auth } from '@/auth';

// Server-side helper: reads the NextAuth session, pulls out the Nest access
// token stashed there at login, and calls the Nest API with it as a Bearer
// token. Use this from Server Components / Route Handlers / Server Actions
// only -- it reads cookies via `auth()`, which needs the request context.
export async function apiFetch(path: string, init: RequestInit = {}) {
  const session = await auth();

  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  return fetch(`${process.env.RESUME_API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
}

export function isSessionExpired(error: unknown): boolean {
  return error instanceof Error && error.message === 'SESSION_EXPIRED';
}

// Every dashboard page trusted apiFetch's parsed JSON body as the
// expected data shape with no .ok check -- the Nest-issued access token
// stashed in the NextAuth session is only good for 7 days (see
// auth.module.ts's signOptions.expiresIn), so any session left open past
// that keeps looking "logged in" (NextAuth's own cookie is unrelated and
// doesn't expire the same way) while every API call now 401s. The
// unchecked .json() then crashed deep in page rendering (a .reduce/.map
// on an error body shaped like {message, statusCode}) with no
// indication the real problem was just an expired token. Throwing a
// specific, recognizable error here lets the error boundary show "please
// log in again" instead of a generic crash message.
export async function apiFetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await apiFetch(path, init);
  if (response.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      `Request to ${path} failed with ${response.status}${body?.message ? `: ${body.message}` : ''}`,
    );
  }
  return response.json() as Promise<T>;
}
