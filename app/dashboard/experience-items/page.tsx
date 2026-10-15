import { apiFetch } from '@/lib/api';
import { TYPE_BADGE_CLASSES } from '../type-colors';
import { FilterBar } from './filter-bar';

export const instant = false;

interface ExperienceItemRow {
  id: string;
  type: string;
  title: string;
  organization: string | null;
  startDate: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

interface AdminUser {
  id: string;
  name: string;
}

export default async function ExperienceItemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const get = (key: string) => (typeof params[key] === 'string' ? (params[key] as string) : '');
  const type = get('type');
  const userId = get('userId');
  const search = get('search');
  const sortBy = get('sortBy') || 'createdAt';
  const order = get('order') || 'desc';

  const query = new URLSearchParams();
  if (type) query.set('type', type);
  if (userId) query.set('userId', userId);
  if (search) query.set('search', search);
  query.set('sortBy', sortBy);
  query.set('order', order);

  const [itemsRes, usersRes] = await Promise.all([
    apiFetch(`/admin/experience-items?${query.toString()}`),
    apiFetch('/admin/users'),
  ]);
  const items: ExperienceItemRow[] = await itemsRes.json();
  const users: AdminUser[] = await usersRes.json();

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-lg font-semibold">Experience items ({items.length})</h1>

      <FilterBar
        action="/dashboard/experience-items"
        users={users}
        current={{ type, userId, search, sortBy, order }}
      />

      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Organization</th>
              <th>User</th>
              <th>Start date</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={`chip ${TYPE_BADGE_CLASSES[item.type]}`} style={{ border: 'none', padding: '0.15rem 0.6rem', fontSize: '0.72rem' }}>
                    {item.type}
                  </span>
                </td>
                <td>{item.title}</td>
                <td className="muted">{item.organization ?? '—'}</td>
                <td className="muted">{item.user.name}</td>
                <td className="muted">{item.startDate ? new Date(item.startDate).toLocaleDateString() : '—'}</td>
                <td className="muted">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="p-4 text-sm muted">No items match these filters.</p>}
      </div>
    </div>
  );
}
