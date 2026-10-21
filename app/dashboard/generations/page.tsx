import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { FilterBar } from './filter-bar';

export const instant = false;

interface GenerationRow {
  id: string;
  jobDescription: string;
  fitScore: number;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

interface AdminUser {
  id: string;
  name: string;
}

function scoreColorClass(score: number): string {
  if (score >= 80) {
    return 'bg-green-100 text-green-900 dark:bg-green-900/60 dark:text-green-200';
  }
  if (score >= 50) {
    return 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200';
  }
  return 'bg-red-100 text-red-900 dark:bg-red-900/60 dark:text-red-200';
}

export default async function GenerationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const get = (key: string) => (typeof params[key] === 'string' ? (params[key] as string) : '');
  const userId = get('userId');
  const sortBy = get('sortBy') || 'createdAt';
  const order = get('order') || 'desc';

  const query = new URLSearchParams();
  if (userId) query.set('userId', userId);
  query.set('sortBy', sortBy);
  query.set('order', order);

  const [generationsRes, usersRes] = await Promise.all([
    apiFetch(`/admin/resume-generations?${query.toString()}`),
    apiFetch('/admin/users'),
  ]);
  const generations: GenerationRow[] = await generationsRes.json();
  const users: AdminUser[] = await usersRes.json();

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-lg font-semibold">Resume generations ({generations.length})</h1>

      <FilterBar action="/dashboard/generations" users={users} current={{ userId, sortBy, order }} />

      <div className="space-y-2">
        {generations.map((gen) => (
          <div key={gen.id} className="card flex items-center gap-3">
            <span
              className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-sm font-semibold ${scoreColorClass(gen.fitScore)}`}
            >
              {gen.fitScore}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                {gen.jobDescription.slice(0, 100)}
                {gen.jobDescription.length > 100 ? '...' : ''}
              </p>
              <p className="text-xs muted">
                <Link href={`/dashboard/users/${gen.user.id}`} className="link">
                  {gen.user.name}
                </Link>{' '}
                · {new Date(gen.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {generations.length === 0 && <p className="text-sm muted">No generations match this filter.</p>}
      </div>
    </div>
  );
}
