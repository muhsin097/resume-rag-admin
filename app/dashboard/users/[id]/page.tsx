import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { TYPE_BADGE_CLASSES } from '../../type-colors';

export const instant = false;

interface ExperienceItem {
  id: string;
  type: string;
  title: string;
  organization: string | null;
  startDate: string | null;
  endDate: string | null;
}

interface ResumeGeneration {
  id: string;
  jobDescription: string;
  matchScore: number;
  createdAt: string;
}

interface UserDetail {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  plan: string;
  jobSearchEnabled: boolean;
  freeGenerationsUsed: number;
  createdAt: string;
  experienceItems: ExperienceItem[];
  resumeGenerations: ResumeGeneration[];
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

function formatRange(start: string | null, end: string | null) {
  if (!start && !end) return null;
  const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  return `${start ? fmt(start) : '?'} – ${end ? fmt(end) : 'present'}`;
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiFetch(`/admin/users/${id}`);
  const user: UserDetail = await res.json();

  const grouped = new Map<string, ExperienceItem[]>();
  for (const item of user.experienceItems) {
    grouped.set(item.type, [...(grouped.get(item.type) ?? []), item]);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/dashboard/users" className="link text-sm">
        ← All users
      </Link>

      <div className="card space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">{user.name}</h1>
            <p className="text-sm muted">{user.email}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <span className="chip">{user.plan}</span>
            <span className="chip">Open to work: {user.jobSearchEnabled ? 'Yes' : 'No'}</span>
            <span className="chip">{user.freeGenerationsUsed}/5 generations used</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm muted">
          {user.phone && <span>{user.phone}</span>}
          {user.location && <span>{user.location}</span>}
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        {user.bio && <p className="text-sm">{user.bio}</p>}
      </div>

      <div className="card space-y-4">
        <div className="section-label">Experience items ({user.experienceItems.length})</div>
        {[...grouped.entries()].map(([type, items]) => (
          <div key={type} className="space-y-2">
            <span className={`chip ${TYPE_BADGE_CLASSES[type]}`} style={{ border: 'none' }}>
              {type} · {items.length}
            </span>
            <ul className="space-y-1">
              {items.map((item) => {
                const range = formatRange(item.startDate, item.endDate);
                return (
                  <li key={item.id} className="text-sm">
                    <span className="font-medium">{item.title}</span>
                    {item.organization && <span className="muted"> · {item.organization}</span>}
                    {range && <span className="muted"> · {range}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {user.experienceItems.length === 0 && <p className="text-sm muted">No experience items yet.</p>}
      </div>

      <div className="card space-y-3">
        <div className="section-label">Generation history ({user.resumeGenerations.length})</div>
        {user.resumeGenerations.map((gen) => (
          <div key={gen.id} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-semibold ${scoreColorClass(gen.matchScore)}`}
            >
              {gen.matchScore}
            </span>
            <span className="text-sm">
              {new Date(gen.createdAt).toLocaleString()} ·{' '}
              {gen.jobDescription.slice(0, 80)}
              {gen.jobDescription.length > 80 ? '...' : ''}
            </span>
          </div>
        ))}
        {user.resumeGenerations.length === 0 && <p className="text-sm muted">No generations yet.</p>}
      </div>
    </div>
  );
}
