"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";
import { getPujas, getCategories } from "@/lib/api/pujas";
import type { PujaCategory, PujaServiceSummary } from "@/types/puja";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function PujasPage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<PujaCategory[]>([]);
  const [pujas, setPujas] = useState<PujaServiceSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [catsData, pujasData] = await Promise.all([
          getCategories().catch(() => []),
          getPujas({
            category: selectedCategory === "all" ? undefined : selectedCategory,
            search: searchQuery.trim() || undefined,
          }).catch(() => ({ items: [], total: 0 })),
        ]);
        setCategories(catsData);
        setPujas(pujasData.items || []);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-amber-50/30 text-amber-950 flex flex-col">
      <SiteHeader />

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-amber-100/50 via-orange-50/20 to-amber-50 py-10 px-4 border-b border-amber-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-xs font-semibold text-orange-800 mb-3">
            <span>卐</span>
            <span>{language === "hi" ? "सम्पूर्ण वैदिक पूजा सूची" : "Sacred Vedic Puja Catalog"}</span>
            <span>卐</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950 tracking-tight">
            {language === "hi" ? "अपने घर पर कराएं प्रामाणिक वैदिक पूजा" : "Book Authentic Vedic Pujas at Your Home"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-700 max-w-xl mx-auto">
            {language === "hi"
              ? "गुरुकुल प्रशिक्षित एवं आचार्य पदवी प्राप्त पुरोहितों द्वारा शास्त्रीय विधि से पूजा एवं हवन।"
              : "Conducted strictly as per Shastric Vidhi by certified Gurukul-trained Acharyas with pure Vedic Samagri."}
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Input
              type="text"
              placeholder={language === "hi" ? "पूजा का नाम खोजें (जैसे गृह प्रवेश, रुद्राभिषेक)..." : "Search by puja name (e.g. Griha Pravesh)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl border-amber-200 bg-white shadow-xs pl-10 pr-4 text-xs sm:text-sm focus:border-orange-500 focus:ring-orange-500/20"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 text-sm">
              🔍
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-amber-100 mb-6">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-amber-900 text-white shadow-sm"
                : "bg-white text-amber-700 border border-amber-100 hover:border-amber-200"
            }`}
          >
            🪔 {language === "hi" ? "सभी पूजाएँ" : "All Pujas"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-white text-amber-700 border border-amber-100 hover:border-amber-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{language === "hi" ? cat.name_hi : cat.name}</span>
            </button>
          ))}
        </div>

        {/* Loading Skeleton or Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-amber-100/60 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : pujas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-amber-100">
            <span className="text-4xl block mb-2">🪔</span>
            <h3 className="text-base font-bold text-amber-800">
              {language === "hi" ? "कोई पूजा नहीं मिली" : "No Pujas Found"}
            </h3>
            <p className="text-xs text-amber-600 mt-1">
              {language === "hi" ? "कृपया अन्य श्रेणी या खोज शब्द चुनें।" : "Try adjusting your search query or category filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pujas.map((puja) => (
              <Card
                key={puja.id}
                className="group bg-white border border-amber-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Top accent bar */}
                  <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl p-2 rounded-xl bg-orange-50 border border-orange-100">
                        {puja.icon}
                      </span>
                      {puja.badge && (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-[10px] font-semibold">
                          {puja.badge}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-amber-900 group-hover:text-orange-600 transition-colors">
                      {language === "hi" ? puja.name_hi : puja.name}
                    </h3>
                    <p className="text-xs text-amber-600 mt-0.5 mb-3 line-clamp-1">
                      {language === "hi" ? puja.sub_title_hi || puja.sub_title : puja.sub_title}
                    </p>

                    {/* Benefits bullet pills */}
                    {puja.benefits && puja.benefits.length > 0 && (
                      <div className="space-y-1 mb-4">
                        {puja.benefits.slice(0, 2).map((b, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-amber-700">
                            <span className="text-orange-500 font-bold">✓</span>
                            <span className="line-clamp-1">{b}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="px-5 py-3.5 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-500 block uppercase font-medium">
                      {language === "hi" ? "दक्षिणा" : "Dakshina"}
                    </span>
                    <span className="text-base font-extrabold text-orange-600">
                      ₹{puja.base_dakshina.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link href={`/pujas/${puja.slug}`}>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg px-4 h-9">
                      {language === "hi" ? "विवरण एवं बुकिंग" : "View & Book"} →
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
