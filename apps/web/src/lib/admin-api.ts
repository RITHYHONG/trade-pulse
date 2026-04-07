export async function fetchAdminUsers() {
  const res = await fetch('/api/admin/roles', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateUserRole(uid: string, role: string) {
  const res = await fetch('/api/admin/roles', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, role }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || 'Failed to update role');
  }
  return res.json();
}
