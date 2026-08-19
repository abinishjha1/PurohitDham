"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminStats } from "@/lib/api/admin";
import type { AdminStats } from "@/types/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    total_revenue: 0,
    total_bookings: 0,
    active_pujas: 20,
    verified_pandits: 0,
    pending_bookings: 0,
    completed_bookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        // Fallback default
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: "Total Dakshina Revenue",
      value: `₹${stats.total_revenue.toLocaleString("en-IN")}`,
      icon: "💰",
      color: "from-emerald-600/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Active Puja Cards",
      value: stats.active_pujas,
      icon: "🪔",
      color: "from-orange-600/20 to-orange-900/10 border-orange-500/30 text-orange-400",
    },
    {
      title: "Verified Acharyas",
      value: stats.verified_pandits,
      icon: "🕉️",
      color: "from-amber-600/20 to-amber-900/10 border-amber-500/30 text-amber-400",
    },
    {
      title: "Total Bookings",
      value: stats.total_bookings,
      icon: "📅",
      color: "from-blue-600/20 to-blue-900/10 border-blue-500/30 text-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time management for Pujas, Verified Pandits, and Customer Bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/pujas">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold">
              ➕ Add New Puja Card
            </Button>
          </Link>
          <Link href="/admin/bookings">
            <Button size="sm" variant="outline" className="border-stone-700 text-stone-300 hover:bg-stone-800 text-xs">
              📅 Review Bookings
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, idx) => (
          <Card key={idx} className={`bg-gradient-to-br ${c.color} border rounded-2xl shadow-lg`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  {c.title}
                </span>
                <span className="text-2xl">{c.icon}</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {isLoading ? "..." : c.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Management Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>⚡</span>
              <span>Administrative Controls</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/admin/pujas" className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:border-orange-500/50 hover:bg-stone-800 transition-all group">
                <span className="text-2xl block mb-2">🪔</span>
                <h4 className="text-xs font-bold text-white group-hover:text-orange-400">
                  Manage Puja Cards
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Add new rituals, change Dakshina prices, or modify samagri lists on the homepage.
                </p>
              </Link>

              <Link href="/admin/pandits" className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:border-orange-500/50 hover:bg-stone-800 transition-all group">
                <span className="text-2xl block mb-2">🕉️</span>
                <h4 className="text-xs font-bold text-white group-hover:text-orange-400">
                  Verify & Add Pandits
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Approve Gurukul credentials, verify GPS home locations, and register Acharyas.
                </p>
              </Link>

              <Link href="/admin/bookings" className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:border-orange-500/50 hover:bg-stone-800 transition-all group">
                <span className="text-2xl block mb-2">📅</span>
                <h4 className="text-xs font-bold text-white group-hover:text-orange-400">
                  Booking Confirmations
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Confirm upcoming Yajman ceremonies and assign available local Pandits.
                </p>
              </Link>

              <Link href="/admin/users" className="p-4 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:border-orange-500/50 hover:bg-stone-800 transition-all group">
                <span className="text-2xl block mb-2">👥</span>
                <h4 className="text-xs font-bold text-white group-hover:text-orange-400">
                  User Roles & Access
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Promote accounts to Admin or Pandit role and manage system security.
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: System Status */}
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>🛡️</span>
              <span>System & Security</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-800/40 border border-stone-800">
                <span className="text-stone-400">API Status</span>
                <span className="text-emerald-400 font-semibold">● Healthy</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-800/40 border border-stone-800">
                <span className="text-stone-400">Database Engine</span>
                <span className="text-emerald-400 font-semibold">PostgreSQL Async</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-800/40 border border-stone-800">
                <span className="text-stone-400">GPS Geolocation</span>
                <span className="text-emerald-400 font-semibold">Active (HTML5)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-800/40 border border-stone-800">
                <span className="text-stone-400">Role Restriction</span>
                <span className="text-orange-400 font-semibold">Admin Exclusive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
