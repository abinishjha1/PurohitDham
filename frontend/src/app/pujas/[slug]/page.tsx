"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { getPujaBySlug } from "@/lib/api/pujas";
import type { PujaServiceDetail } from "@/types/puja";

export default function PujaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [puja, setPuja] = useState<PujaServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(0);

  useEffect(() => {
    async function loadPuja() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await getPujaBySlug(slug);
        setPuja(data);
      } catch {
        setPuja(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadPuja();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl animate-bounce">🪔</span>
          <p className="text-xs text-stone-500 font-medium">Loading Vedic Vidhi...</p>
        </div>
      </div>
    );
  }

  if (!puja) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl border border-stone-200 shadow-sm max-w-md">
          <span className="text-4xl block mb-2">🕉️</span>
          <h2 className="text-lg font-bold text-stone-900">Puja Ritual Not Found</h2>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            The requested Vedic ceremony does not exist or has been relocated.
          </p>
          <Link href="/pujas">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
              ← Back to Puja Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const selectedPkg = puja.packages && puja.packages.length > 0 ? puja.packages[selectedPackageIdx] : null;
  const currentPrice = selectedPkg ? selectedPkg.price : puja.base_dakshina;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-orange-600 text-xl font-bold">ॐ</span>
            <span className="text-lg font-extrabold tracking-tight text-stone-900">
              Purohit<span className="text-orange-600">dham</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/pujas">
              <Button variant="ghost" size="sm" className="text-xs text-stone-600">
                ← {language === "hi" ? "सभी पूजाएँ" : "All Pujas"}
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                {language === "hi" ? "लॉगिन" : "Sign In"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Puja Information, Vidhi & Samagri */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl p-2 rounded-xl bg-orange-50 border border-orange-100">
                  {puja.icon}
                </span>
                <div>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-[10px]">
                    {puja.category_name || "Vedic Ritual"}
                  </Badge>
                  <span className="text-xs text-stone-500 ml-2">
                    ⏱ {puja.duration_minutes} Mins Duration
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 mt-2">
                {language === "hi" ? puja.name_hi : puja.name}
              </h1>
              <p className="text-sm font-medium text-orange-700 mt-1">
                {language === "hi" ? puja.sub_title_hi : puja.sub_title}
              </p>

              <div className="mt-4 pt-4 border-t border-stone-100 text-xs sm:text-sm text-stone-700 leading-relaxed">
                {language === "hi" ? puja.description_hi : puja.description}
              </div>
            </div>

            {/* Benefits */}
            {puja.benefits && puja.benefits.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-800 mb-3 flex items-center gap-2">
                  <span>🪷</span>
                  <span>{language === "hi" ? "पूजा के आध्यात्मिक एवं भौतिक लाभ" : "Key Spiritual & Life Benefits"}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {puja.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-700">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vidhi Steps Timeline */}
            {puja.vidhi_steps && puja.vidhi_steps.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-800 mb-4 flex items-center gap-2">
                  <span>📜</span>
                  <span>{language === "hi" ? "सम्पूर्ण शास्त्रीय विधि क्रम" : "Vedic Vidhi & Step-by-Step Procedure"}</span>
                </h3>
                <div className="space-y-3">
                  {puja.vidhi_steps.map((v, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {v.step || idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{v.title}</h4>
                        <p className="text-xs text-stone-600 mt-0.5">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Samagri Checklist */}
            {puja.samagri_list && puja.samagri_list.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-orange-800 flex items-center gap-2">
                    <span>🌿</span>
                    <span>{language === "hi" ? "पूजा सामग्री सूची (पंडित जी द्वारा सम्मिलित)" : "Included Pure Vedic Samagri List"}</span>
                  </h3>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    100% Pure & Vedic
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {puja.samagri_list.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                      <span className="text-stone-800 font-medium">{s.item}</span>
                      <span className="text-stone-500 text-[11px] font-semibold">{s.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking & Package Box */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-lg shadow-stone-900/5 sticky top-20">
              <div className="h-1 bg-gradient-to-r from-red-800 via-amber-500 to-orange-600 -mx-6 -mt-6 mb-5 rounded-t-2xl" />

              <span className="text-xs font-semibold text-stone-500 block uppercase">
                {language === "hi" ? "चयनित पैकेज दक्षिणा" : "Selected Package Dakshina"}
              </span>
              <div className="flex items-baseline gap-2 mt-1 mb-4">
                <span className="text-3xl font-extrabold text-orange-600">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-stone-400">
                  ({language === "hi" ? "समस्त सामग्री सहित" : "Complete with Samagri"})
                </span>
              </div>

              {/* Package Tier Options */}
              {puja.packages && puja.packages.length > 0 && (
                <div className="space-y-2 mb-5">
                  <label className="text-xs font-semibold text-stone-700 block">
                    {language === "hi" ? "पैकेज का चयन करें:" : "Select Package Tier:"}
                  </label>
                  {puja.packages.map((pkg, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPackageIdx(idx)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPackageIdx === idx
                          ? "border-orange-500 bg-orange-50/50 shadow-xs"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{pkg.name}</span>
                        <span className="text-xs font-extrabold text-orange-600">₹{pkg.price}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{pkg.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Trust Indicators */}
              <div className="space-y-2 py-3 border-y border-stone-100 mb-5 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Gurukul Certified Senior Pandit Ji</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Pure Gangajal, Havan Samagri included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Instant Booking Confirmation</span>
                </div>
              </div>

              {/* Booking CTA Button */}
              <Button className="w-full h-11 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 text-xs">
                🪔 {language === "hi" ? "अभी पंडित जी बुक करें" : "Book Pandit Ji Now"}
              </Button>

              <p className="text-[10px] text-stone-400 text-center mt-2.5">
                🔒 Safe & Verified • 100% Shastric Guarantee
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
