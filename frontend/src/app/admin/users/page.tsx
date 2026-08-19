"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminUsers, updateAdminUserRole } from "@/lib/api/admin";
import type { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateAdminUserRole(userId, newRole);
      await loadUsers();
    } catch {
      alert("Failed to change user role.");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            User Accounts & Role Permissions
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage user permissions, promote administrators, and oversee registered accounts.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-xs">
        <Input
          type="text"
          placeholder="Search by name, email, or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 bg-stone-900 border-stone-800 text-white text-xs rounded-xl focus:border-orange-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/60 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {u.full_name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 text-stone-300">
                      {u.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        className={`text-[10px] ${
                          u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : u.role === "PANDIT"
                            ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                            : "bg-stone-800 text-stone-300"
                        }`}
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="h-8 px-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold"
                      >
                        <option value="CUSTOMER">Customer (Yajman)</option>
                        <option value="PANDIT">Pandit</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
