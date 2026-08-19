"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/pujas", label: "Puja Cards & Catalog", icon: "🪔" },
  { href: "/admin/pandits", label: "Pandits & Verification", icon: "🕉️" },
  { href: "/admin/bookings", label: "Live Bookings", icon: "📅" },
  { href: "/admin/users", label: "Users & Roles", icon: "👥" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        setAuthorized(false);
      } else {
        const roleStr = typeof user.role === "string" ? user.role.toUpperCase() : "";
        if (roleStr === "ADMIN" || roleStr === "SUPER_ADMIN") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      }
    }
  }, [user, isAuthenticated, isLoading]);

  if (isLoading || authorized === null) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xl animate-spin">⚙️</span>
          <p className="text-xs text-stone-400 font-semibold tracking-wider uppercase">
            Verifying Admin Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-stone-800 p-8 rounded-2xl max-w-md w-full text-center text-white shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4 text-xl">
            🔒
          </div>
          <h2 className="text-lg font-bold text-stone-100">Restricted Admin Access</h2>
          <p className="text-xs text-stone-400 mt-2 mb-6 leading-relaxed">
            This area is strictly reserved for Purohitdham Administrators. You must be signed in with an authorized Admin account to continue.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/login">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-5">
                Sign In as Admin
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-stone-700 text-stone-300 hover:bg-stone-800 text-xs">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-64 bg-stone-900/90 border-r border-stone-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2 px-3 py-3 mb-6 border-b border-stone-800">
            <span className="text-orange-500 text-2xl font-bold">ॐ</span>
            <div>
              <span className="text-sm font-extrabold tracking-tight text-white block">
                Purohit<span className="text-orange-500">dham</span>
              </span>
              <span className="text-[10px] text-orange-400 font-semibold tracking-wider uppercase">
                Admin Command Center
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-orange-600 text-white shadow-md shadow-orange-600/20 font-semibold"
                      : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Live Site Link */}
        <div className="pt-4 border-t border-stone-800 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-stone-800/50 border border-stone-800 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
              <p className="text-[10px] text-orange-400 uppercase font-bold">{String(user?.role)}</p>
            </div>
            <span className="text-emerald-400 text-xs">● Active</span>
          </div>

          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white"
            >
              🌐 View Live Website →
            </Button>
          </Link>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-stone-800 bg-stone-900/60 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Control Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">
              Welcome, <strong className="text-white">{user?.full_name}</strong>
            </span>
            <Link href="/">
              <Button size="sm" variant="ghost" className="text-xs text-stone-400 hover:text-white">
                Exit to Website
              </Button>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-stone-950">
          {children}
        </main>
      </div>
    </div>
  );
}
