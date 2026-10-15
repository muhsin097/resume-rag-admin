'use client';

import { useRef } from 'react';

const EXPERIENCE_TYPES = ['EXPERIENCE', 'EDUCATION', 'CERTIFICATION', 'PROJECT', 'ACHIEVEMENT', 'SKILL'];

export function FilterBar({
  action,
  users,
  current,
}: {
  action: string;
  users: { id: string; name: string }[];
  current: { type: string; userId: string; search: string; sortBy: string; order: string };
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} method="get" action={action} className="card flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="section-label">Type</span>
        <select
          name="type"
          defaultValue={current.type}
          className="select"
          onChange={() => formRef.current?.requestSubmit()}
        >
          <option value="">All types</option>
          {EXPERIENCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

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
          <option value="startDate">Start date</option>
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
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </label>

      <label className="flex flex-1 min-w-[10rem] flex-col gap-1">
        <span className="section-label">Search title / org</span>
        <input type="search" name="search" defaultValue={current.search} placeholder="e.g. React" className="input" />
      </label>

      <button type="submit" className="btn-primary">
        Apply
      </button>
    </form>
  );
}
