import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export const instant = false;

interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  jobSearchEnabled: boolean;
  freeGenerationsUsed: number;
  createdAt: string;
  _count: { experienceItems: number; resumeGenerations: number };
}

function sortLink(
  column: 'name' | 'createdAt',
  current: { sortBy: string; order: string },
) {
  const nextOrder = current.sortBy === column && current.order === 'asc' ? 'desc' : 'asc';
  return `/dashboard/users?sortBy=${column}&order=${nextOrder}`;
}

function sortIndicator(column: string, current: { sortBy: string; order: string }) {
  if (current.sortBy !== column) return '';
  return current.order === 'asc' ? ' ▲' : ' ▼';
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy : 'createdAt';
  const order = typeof params.order === 'string' ? params.order : 'desc';

  const res = await apiFetch(`/admin/users?sortBy=${sortBy}&order=${order}`);
  const users: AdminUser[] = await res.json();
  const current = { sortBy, order };

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-lg font-semibold">Users</h1>

      <div className="card overflow-x-auto p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <Link href={sortLink('name', current)}>Name{sortIndicator('name', current)}</Link>
              </th>
              <th>Email</th>
              <th>Plan</th>
              <th>Open to work</th>
              <th>Items</th>
              <th>Generations</th>
              <th>Free used</th>
              <th>
                <Link href={sortLink('createdAt', current)}>
                  Joined{sortIndicator('createdAt', current)}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link href={`/dashboard/users/${user.id}`} className="link">
                    {user.name}
                  </Link>
                </td>
                <td className="muted">{user.email}</td>
                <td>{user.plan}</td>
                <td>{user.jobSearchEnabled ? 'Yes' : 'No'}</td>
                <td>{user._count.experienceItems}</td>
                <td>{user._count.resumeGenerations}</td>
                <td>{user.freeGenerationsUsed}/5</td>
                <td className="muted">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
