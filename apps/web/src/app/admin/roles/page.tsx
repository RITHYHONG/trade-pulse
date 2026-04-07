"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type UserItem = { id: string; name: string; email: string; role: string };

const ROLES = ["admin", "manager", "staff", "viewer", "user"];

export default function AdminRolesPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/roles", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        toast.error(data?.error || "Failed to load users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(uid: string, role: string, i: number) {
    const prev = users[i];
    setUsers((s) => s.map((u) => (u.id === uid ? { ...u, role } : u)));
    try {
      const res = await fetch("/api/admin/roles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update role");
      }
      toast.success("Role updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update role");
      // rollback
      setUsers((s) => s.map((u) => (u.id === uid ? prev : u)));
    }
  }

  const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-sm text-slate-400">Quickly assign and review user roles.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm"
          />
          <Button onClick={fetchUsers} className="bg-primary">Refresh</Button>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800">
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-slate-400">Loading users…</div>
            ) : filtered.length === 0 ? (
              <div className="text-slate-500">No users found.</div>
            ) : (
              filtered.map((u, i) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-300">{(u.name || u.email || '').charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="font-semibold text-slate-100">{u.name || u.email}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-700/20 text-purple-300' : u.role === 'manager' ? 'bg-indigo-700/20 text-indigo-300' : u.role === 'staff' ? 'bg-emerald-700/20 text-emerald-300' : 'bg-slate-700/20 text-slate-300'}`}>{u.role}</span>
                    <select
                      value={u.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        if (!confirm(`Change role for ${u.name || u.email} to '${newRole}'?`)) return;
                        updateRole(u.id, newRole, i);
                      }}
                      className="bg-slate-900 border border-slate-800 rounded-md px-3 py-1"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-slate-400">Tip: Use the search box to quickly find users by name or email.</div>
    </div>
  );
}
