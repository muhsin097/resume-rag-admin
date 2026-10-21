'use client';

import { useRef } from 'react';

export function FilterBar({
  action,
  users,
  current,
}: {
  action: string;
  users: { id: string; name: string }[];
  current: { userId: string; sortBy: string; order: string };
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} method="get" action={action} className="card flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="section-label">User</span>
        <select
          name="userId"
          defaultValue={current.userId}
          className="select"
          onChange={() => formRef.current?.requestSubmit()}
        >
          <option value="">All users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="section-label">Sort by</span>
        <select
          name="sortBy"
          defaultValue={current.sortBy}
          className="select"
          onChange={() => formRef.current?.requestSubmit()}
        >
          <option value="createdAt">Created date</option>
          <option value="fitScore">Fit score</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="section-label">Order</span>
        <select
          name="order"
          defaultValue={current.order}
          className="select"
          onChange={() => formRef.current?.requestSubmit()}
        >
          <option value="desc">Highest / newest first</option>
          <option value="asc">Lowest / oldest first</option>
        </select>
      </label>

      <button type="submit" className="btn-primary">
        Apply
      </button>
    </form>
  );
}
