"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language-context";

/**
 * Shared public site footer — deep amber panel with brand, service links,
 * sanskars, and support. Bilingual via the language context.
 */
export function SiteFooter() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-amber-950 text-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-400 text-xl font-bold">ॐ</span>
              <span className="text-lg font-bold">{t.brandName}</span>
            </div>
            <p className="text-xs text-amber-400/70 leading-relaxed mb-3">{t.footerDesc}</p>
            <p className="text-[11px] text-amber-500/60 italic">{t.footerMotto}</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-3">{t.footerColServices}</h4>
            <ul className="space-y-1.5 text-xs text-amber-400/70">
              {t.pujaOptions.slice(0, 6).map((puja, i) => (
                <li key={i}>
                  <Link href="/pujas" className="hover:text-amber-200 transition-colors">
                    {puja}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sanskars */}
          <div>
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-3">{t.footerColSanskars}</h4>
            <ul className="space-y-1.5 text-xs text-amber-400/70">
              <li>
                <Link href="/pujas" className="hover:text-amber-200 transition-colors">
                  {language === "hi" ? "वैदिक विवाह संस्कार" : "Vedic Marriage"}
                </Link>
              </li>
              <li>
                <Link href="/pujas" className="hover:text-amber-200 transition-colors">
                  {language === "hi" ? "नामकरण संस्कार" : "Naamkaran"}
                </Link>
              </li>
              <li>
                <Link href="/pujas" className="hover:text-amber-200 transition-colors">
                  {language === "hi" ? "यज्ञोपवीत संस्कार" : "Yagnopavit"}
                </Link>
              </li>
              <li>
                <Link href="/pujas" className="hover:text-amber-200 transition-colors">
                  {language === "hi" ? "श्राद्ध विधि" : "Shradh Vidhi"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-3">{t.footerColSupport}</h4>
            <ul className="space-y-1.5 text-xs text-amber-400/70 mb-4">
              <li>{t.footerHelpline}</li>
              <li>{t.footerEmail}</li>
              <li>{t.footerTiming}</li>
            </ul>
            <Link href="/pandit/onboard">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs border-amber-600 bg-amber-900/50 hover:bg-amber-800 text-amber-200"
              >
                {t.footerBtnJoinPandit}
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="my-6 bg-amber-800/60" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-500/60 text-center sm:text-left">
          <p>{t.footerCopyright}</p>
          <p className="flex items-center gap-2">
            <span>{t.footerPeaceChant}</span>
            <span>•</span>
            <span>{t.footerMadeWith}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
