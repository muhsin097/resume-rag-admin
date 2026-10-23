import { apiFetchJson } from '@/lib/api';
import { TYPE_BADGE_CLASSES } from './type-colors';

export const instant = false;

interface Overview {
  userCount: number;
  itemCount: number;
  itemsByType: { type: string; count: number }[];
  generationCount: number;
  avgMatchScore: number;
  topSkills: { title: string; count: number }[];
  generationsByDay: { date: string; count: number }[];
}

const TREND_WINDOW_DAYS = 14;

// Fills in zero-count days so the sparkline shows a continuous window
// instead of just the days that happened to have a generation.
function buildTrend(byDay: { date: string; count: number }[]) {
  const counts = new Map(byDay.map((row) => [row.date, row.count]));
  const days: { date: string; count: number }[] = [];
  for (let i = TREND_WINDOW_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return days;
}

export default async function OverviewPage() {
  const overview = await apiFetchJson<Overview>('/admin/overview');

  const typeTotal = overview.itemsByType.reduce((sum, row) => sum + row.count, 0) || 1;
  const maxSkillCount = Math.max(1, ...overview.topSkills.map((s) => s.count));
  const trend = buildTrend(overview.generationsByDay);
  const maxTrendCount = Math.max(1, ...trend.map((d) => d.count));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-lg font-semibold">Overview</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="stat-tile">
          <div className="n">{overview.userCount}</div>
          <div className="l">Users</div>
        </div>
        <div className="stat-tile">
          <div className="n">{overview.itemCount}</div>
          <div className="l">Experience items</div>
        </div>
        <div className="stat-tile">
          <div className="n">{overview.generationCount}</div>
          <div className="l">Resumes generated</div>
        </div>
        <div className="stat-tile">
          <div className="n">{overview.avgMatchScore}</div>
          <div className="l">Avg. match score</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-3">
          <div className="section-label">Profile makeup across all users</div>
          <div className="flex h-2.5 overflow-hidden rounded-full" style={{ background: 'var(--surface-muted)' }}>
            {overview.itemsByType.map((row) => (
              <span
                key={row.type}
                className={TYPE_BADGE_CLASSES[row.type]}
                style={{ width: `${(row.count / typeTotal) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {overview.itemsByType.map((row) => (
              <span key={row.type} className={`chip ${TYPE_BADGE_CLASSES[row.type]}`} style={{ border: 'none' }}>
                {row.type}
                <span className="muted">{row.count}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="card space-y-3">
          <div className="section-label">Generations, last {TREND_WINDOW_DAYS} days</div>
          <div className="flex items-end gap-1" style={{ height: '72px' }}>
            {trend.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count}`}
                className="flex-1 rounded-t"
                style={{
                  height: `${Math.max(4, (day.count / maxTrendCount) * 100)}%`,
                  background: day.count > 0 ? 'var(--accent)' : 'var(--surface-muted)',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs muted">
            <span>{trend[0].date}</span>
            <span>{trend[trend.length - 1].date}</span>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="section-label">Most common skills</div>
        {overview.topSkills.length === 0 && <p className="text-sm muted">No skills logged yet.</p>}
        <div className="space-y-2">
          {overview.topSkills.map((skill) => (
            <div key={skill.title} className="flex items-center gap-3">
              <span className="w-40 flex-none truncate text-sm">{skill.title}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--surface-muted)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(skill.count / maxSkillCount) * 100}%`,
                    background: 'var(--accent)',
                  }}
                />
              </div>
              <span className="w-6 flex-none text-right text-sm muted">{skill.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
