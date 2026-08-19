"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getPandits } from "@/lib/api/pandits";
import type { PanditProfile } from "@/types/pandit";

export default function PanditsDirectoryPage() {
  const [pandits, setPandits] = useState<PanditProfile[]>([]);
  const [cityFilter, setCityFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPandits() {
      setIsLoading(true);
      try {
        const data = await getPandits({ city: cityFilter.trim() || undefined });
        setPandits(data.items || []);
      } catch {
        setPandits([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadPandits();
  }, [cityFilter]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-orange-600 text-xl font-bold">ॐ</span>
            <span className="text-lg font-extrabold tracking-tight text-stone-900">
              Purohit<span className="text-orange-600">dham</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/pandit/onboard">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold">
                🕉️ Join as Pandit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-100/50 via-orange-50/20 to-stone-50 py-10 px-4 border-b border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-semibold text-orange-800 mb-3">
            <span>Verified Acharya Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950">
            Certified Gurukul Pandits & Purohits
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Experienced, verified Acharyas in Varanasi, Delhi, Mumbai, Bengaluru, and 500+ cities across India.
          </p>

          <div className="mt-6 max-w-md mx-auto relative">
            <Input
              type="text"
              placeholder="Search by city (e.g. Varanasi, Delhi, Lucknow)..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-11 rounded-xl border-stone-300 bg-white shadow-xs pl-10 pr-4 text-xs sm:text-sm"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
              📍
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-60 bg-stone-200/60 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : pandits.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <span className="text-4xl block mb-2">🕉️</span>
            <h3 className="text-base font-bold text-stone-800">No Pandits Found in this Location</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Be the first Gurukul-trained Acharya to register in your area!
            </p>
            <Link href="/pandit/onboard">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                Register as Pandit
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pandits.map((p) => (
              <Card key={p.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                <div className="h-1 bg-gradient-to-r from-red-800 to-orange-500" />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">
                        {p.title} {p.full_name}
                      </h3>
                      <p className="text-xs text-orange-700 font-medium">{p.education_degree}</p>
                      <p className="text-[11px] text-stone-500">{p.gurukul_name}</p>
                    </div>
                    {p.is_verified && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 my-3 text-xs text-stone-600">
                    <span>📍 {p.city}, {p.state}</span>
                    <span>•</span>
                    <span>⏳ {p.experience_years} Yrs Exp</span>
                    <span>•</span>
                    <span className="text-amber-600 font-bold">★ {p.rating.toFixed(1)}</span>
                  </div>

                  {p.specializations && p.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.specializations.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] text-stone-700">
                          {s}
                        </span>
                      ))}
                      {p.specializations.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-stone-400">
                          +{p.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
