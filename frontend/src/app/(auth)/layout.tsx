"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-amber-50 text-amber-950 relative overflow-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* Background Vedic ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-100/60 via-orange-50/20 to-transparent blur-3xl" />

        {/* Large faint Om symbol */}
        <div className="absolute -top-12 -right-12 text-[200px] leading-none text-amber-200/40 font-serif select-none">
          ॐ
        </div>
        {/* Subtle Swastika symbol */}
        <div className="absolute -bottom-10 -left-10 text-[140px] leading-none text-amber-200/30 font-serif select-none">
          卐
        </div>
      </div>

      {/* Top minimal brand header */}
      <header className="relative z-10 pt-4 pb-2 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group transition-transform hover:scale-[1.02]"
          >
            <span className="text-orange-600 text-2xl font-bold">ॐ</span>
            <span className="text-xl font-extrabold tracking-tight text-amber-950">
              {language === "hi" ? (
                <>पुरोहित<span className="text-orange-600">धाम</span></>
              ) : (
                <>Purohit<span className="text-orange-600">dham</span></>
              )}
            </span>
          </Link>
        </div>
      </header>

      {/* Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-3 relative z-10">
        {children}
      </main>

      {/* Bottom minimal footer */}
      <footer className="relative z-10 text-center py-3 text-xs text-amber-700/80">
        <p>॥ धर्मो रक्षति रक्षितः ॥ &nbsp;•&nbsp; {language === "hi" ? "शुद्ध एवं सत्यापित वैदिक सेवाएं" : "Pure & Verified Vedic Services"}</p>
      </footer>
    </div>
  );
}
