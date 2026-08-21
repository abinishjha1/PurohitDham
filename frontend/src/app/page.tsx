"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language-context";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-amber-50/30">
      <SiteHeader />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
          {/* Subtle background */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-orange-50/30 to-white pointer-events-none" />
          <div className="absolute top-10 right-10 text-[200px] leading-none text-amber-100/40 font-serif select-none hidden lg:block">ॐ</div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 mb-6">
              <span className="text-orange-600 text-sm">卐</span>
              <span className="text-xs sm:text-sm font-semibold text-amber-900">{t.heroBadge}</span>
              <span className="text-orange-600 text-sm">卐</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-amber-950 leading-[1.15]">
              {t.heroTitlePrefix}
              <span className="block mt-1 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                {t.heroTitleHighlight}
              </span>
            </h1>

            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-amber-800/70 leading-relaxed">
              {t.heroDescription}
            </p>

            {/* Search Bar */}
            <div className="mt-8 sm:mt-10 mx-auto max-w-3xl p-3 sm:p-4 rounded-2xl bg-white border border-amber-200 shadow-lg shadow-amber-900/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">{t.searchLabelPuja}</label>
                  <select className="w-full bg-transparent text-sm font-medium text-amber-950 focus:outline-none cursor-pointer">
                    {t.pujaOptions.map((puja, i) => <option key={i}>{puja}</option>)}
                  </select>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">{t.searchLabelCity}</label>
                  <select className="w-full bg-transparent text-sm font-medium text-amber-950 focus:outline-none cursor-pointer">
                    {t.cityOptions.map((city, i) => <option key={i}>{city}</option>)}
                  </select>
                </div>
                <Button className="h-full min-h-[48px] bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20">
                  🪔 {t.searchBtnText}
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-amber-800/70">
              <span className="flex items-center gap-1.5"><span className="text-orange-500">✓</span> {t.trustGurukul}</span>
              <span className="flex items-center gap-1.5"><span className="text-orange-500">✓</span> {t.trustVidhi}</span>
              <span className="flex items-center gap-1.5"><span className="text-orange-500">✓</span> {t.trustSamagri}</span>
              <span className="flex items-center gap-1.5"><span className="text-orange-500">✓</span> {t.trustRating}</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            PUJA SERVICES
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="pujas" className="py-12 sm:py-16 lg:py-20 bg-white border-y border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">
                ॥ {t.servicesSubtitle} ॥
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950">
                {t.servicesTitle}
              </h2>
              <p className="mt-2 text-sm text-amber-700/60 max-w-xl mx-auto">{t.servicesDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {t.services.map((service) => (
                <Card
                  key={service.name}
                  className="group flex flex-col bg-white border border-amber-100 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 rounded-xl overflow-hidden"
                >
                  {/* Accent bar */}
                  <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                  <CardContent className="flex flex-col flex-1 p-4 sm:p-5">
                    {/* ── Top content (grows to fill space) ── */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-2xl p-2 rounded-lg bg-amber-50 border border-amber-100">{service.icon}</span>
                        <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px]">
                          {service.badge}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-amber-950 group-hover:text-orange-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-xs text-amber-600/60 mb-2">{service.subName}</p>
                      <p className="text-xs text-amber-700/50 line-clamp-2">{service.description}</p>
                    </div>

                    {/* ── Bottom pinned section (samagri + price + CTA) ── */}
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded-md mb-3">
                        <span>🌿</span><span className="truncate">{service.samagri}</span>
                      </div>
                      <Separator className="mb-3 bg-amber-100" />
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-amber-600">⏱ {service.duration}</span>
                        <div className="text-right">
                          <span className="text-[10px] text-amber-500 block">{t.dakshinaLabel}</span>
                          <span className="text-lg font-extrabold text-orange-600">{service.price}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg">
                        {t.btnBookThisPuja}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>


          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            VERIFIED PANDITS
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="pandits" className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">
                ॥ {t.panditsSubtitle} ॥
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950">
                {t.panditsTitle}
              </h2>
              <p className="mt-2 text-sm text-amber-700/60 max-w-xl mx-auto">{t.panditsDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {t.pandits.map((pandit) => (
                <Card key={pandit.name} className="bg-white border border-amber-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
                        🕉️
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-amber-950 truncate">{pandit.name}</h3>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] mt-0.5">
                          {t.verifiedPanditBadge}
                        </Badge>
                        <p className="text-xs text-amber-600/70 mt-0.5">{pandit.title}</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { label: t.expLabel, value: pandit.experience },
                        { label: t.gurukulLabel, value: pandit.gurukul },
                        { label: t.langLabel, value: pandit.languages.join(", ") },
                        { label: t.locLabel, value: `📍 ${pandit.location}` },
                        { label: t.specLabel, value: pandit.specialization },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between gap-2">
                          <span className="text-amber-600/60 shrink-0">{row.label}</span>
                          <span className="font-medium text-amber-900 text-right truncate">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-amber-50/60 border-t border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-amber-500">★</span>
                      <span className="font-bold text-amber-900">{pandit.rating}</span>
                      <span className="text-amber-500/70">({pandit.reviewsCount})</span>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs border-amber-200 text-amber-800 hover:bg-amber-100 px-3 h-8">
                      {t.btnViewProfile}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-amber-50/50 border-y border-amber-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">
                ॥ {t.howSubtitle} ॥
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950">
                {t.howTitle}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {t.howSteps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white items-center justify-center text-lg sm:text-xl font-bold shadow-md mb-3">
                    {item.step}
                  </div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                    ॥ {item.sanskrit} ॥
                  </p>
                  <h3 className="text-sm sm:text-base font-bold text-amber-950 mb-1">{item.title}</h3>
                  <p className="text-xs text-amber-700/60 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            WHY TRUST US
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">
                ॥ {t.whySubtitle} ॥
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950">
                {t.whyTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {t.whyValues.map((val, idx) => {
                const icons = ["ॐ", "🪔", "卐", "🪷"];
                return (
                  <div key={val.title} className="p-5 rounded-xl bg-white border border-amber-100 text-center hover:border-orange-200 hover:shadow-md transition-all">
                    <div className="inline-flex w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 items-center justify-center text-xl text-orange-600 mb-3">
                      {icons[idx % icons.length]}
                    </div>
                    <p className="text-[10px] font-bold text-orange-600 mb-1">॥ {val.sanskrit} ॥</p>
                    <h3 className="text-sm sm:text-base font-bold text-amber-950 mb-2">{val.title}</h3>
                    <p className="text-xs text-amber-700/60 leading-relaxed">{val.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FAQ
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-white border-y border-amber-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">
                ॥ {t.faqSubtitle} ॥
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-950">
                {t.faqTitle}
              </h2>
            </div>

            <div className="space-y-3">
              {t.faqs.map((faq) => (
                <div key={faq.q} className="p-4 rounded-xl border border-amber-100 bg-amber-50/30">
                  <h3 className="font-bold text-amber-950 text-sm flex items-start gap-2">
                    <span className="text-orange-600 shrink-0">ॐ</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="mt-2 text-xs text-amber-700/70 leading-relaxed pl-6 border-l-2 border-amber-200 ml-0.5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CTA BANNER
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-3xl block mb-2">🪔</span>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-200 mb-1">{t.ctaShloka}</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">{t.ctaTitle}</h2>
            <p className="mt-3 text-sm text-amber-100 max-w-xl mx-auto">{t.ctaDesc}</p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto px-8 py-5 bg-white hover:bg-amber-50 text-amber-950 font-bold shadow-lg rounded-xl text-sm">
                  {t.ctaBtnPrimary}
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-5 border-2 border-white/70 bg-transparent text-white hover:bg-white/10 font-bold rounded-xl text-sm">
                {t.ctaBtnSecondary}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
