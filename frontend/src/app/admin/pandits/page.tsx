"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAdminPandits, toggleAdminPanditVerify } from "@/lib/api/admin";
import type { PanditProfile } from "@/types/pandit";

export default function AdminPanditsPage() {
  const [pandits, setPandits] = useState<PanditProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPandits = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminPandits();
      setPandits(data);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPandits();
  }, []);

  const handleToggleVerify = async (id: string) => {
    try {
      await toggleAdminPanditVerify(id);
      await loadPandits();
    } catch {
      alert("Failed to update verification status.");
    }
  };

  const filtered = pandits.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.gurukul_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Pandit Directory & Verification Control
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Review Gurukul credentials, verify GPS coordinates, and manage Acharya onboarding status.
          </p>
        </div>

        <Link href="/pandit/onboard" target="_blank">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 h-9">
            ➕ Register New Pandit
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="max-w-xs">
        <Input
          type="text"
          placeholder="Search by name, city, or Gurukul..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 bg-stone-900 border-stone-800 text-white text-xs rounded-xl focus:border-orange-500"
        />
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading Pandits...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No Pandits registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/60 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3 px-4">Acharya Name</th>
                  <th className="py-3 px-4">Education & Gurukul</th>
                  <th className="py-3 px-4">Location & GPS</th>
                  <th className="py-3 px-4">Exp & Rating</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1 rounded-lg bg-stone-800 border border-stone-700">
                          🕉️
                        </span>
                        <div>
                          <p className="font-bold text-white">
                            {p.title} {p.full_name}
                          </p>
                          <p className="text-[11px] text-stone-500">{p.vedic_lineage || "Vedic Purohit"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-stone-200 font-medium">{p.education_degree}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-[200px]">{p.gurukul_name}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-stone-300 font-medium">{p.city}, {p.state}</p>
                      <span className="text-[10px] text-emerald-400">
                        {p.latitude && p.longitude ? `📍 GPS: ${p.latitude.toFixed(2)}, ${p.longitude.toFixed(2)}` : "Manual Address"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-stone-300 font-semibold">{p.experience_years} Yrs</span>
                      <p className="text-[11px] text-amber-400">★ {p.rating.toFixed(1)} ({p.review_count})</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.is_verified ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                          ✓ Verified Acharya
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                          ⏳ Pending Review
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleToggleVerify(p.id)}
                        className={`h-8 text-xs font-semibold px-3 ${
                          p.is_verified
                            ? "bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {p.is_verified ? "Revoke Badge" : "✓ Approve & Verify"}
                      </Button>
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
