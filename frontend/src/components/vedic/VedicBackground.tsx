"use client";

import React from "react";
import { OmIcon, SwastikaIcon, KalashIcon, LotusIcon, VedicMandala } from "./VedicIcons";
import { useLanguage } from "@/contexts/language-context";

export function VedicBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Divine Warm Golden Aura Radiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-amber-400/15 via-orange-500/10 to-transparent blur-3xl rounded-full" />
      <div className="absolute -bottom-40 right-[-10%] w-[700px] h-[700px] bg-gradient-to-t from-orange-400/10 via-amber-300/5 to-transparent blur-3xl rounded-full" />
      <div className="absolute top-1/3 left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-yellow-500/10 via-amber-400/5 to-transparent blur-3xl rounded-full" />

      {/* 2. Rotating Subtle Vedic Mandalas / Yantras */}
      <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] text-amber-600/8 dark:text-amber-400/5 animate-mandala">
        <VedicMandala />
      </div>
      <div className="absolute top-[45%] left-[-200px] w-[600px] h-[600px] text-orange-600/6 dark:text-orange-400/5 animate-mandala" style={{ animationDirection: "reverse", animationDuration: "160s" }}>
        <VedicMandala />
      </div>
      <div className="absolute bottom-[-100px] right-[10%] w-[450px] h-[450px] text-amber-700/6 dark:text-amber-400/5 animate-mandala" style={{ animationDuration: "140s" }}>
        <VedicMandala />
      </div>

      {/* 3. Subtle Floating Sacred Watermarks: ॐ (Om) & 卐 (Swastika) */}
      <div className="absolute top-24 left-[8%] text-amber-700/12 dark:text-amber-400/8 animate-float">
        <OmIcon className="w-20 h-20 filter drop-shadow-sm" />
      </div>
      <div className="absolute top-36 right-[12%] text-orange-600/12 dark:text-orange-400/8 animate-float-delayed">
        <SwastikaIcon className="w-16 h-16 filter drop-shadow-sm" />
      </div>
      <div className="absolute top-[52%] left-[4%] text-amber-600/10 dark:text-amber-400/7 animate-float-delayed">
        <SwastikaIcon className="w-20 h-20 filter drop-shadow-sm" />
      </div>
      <div className="absolute top-[48%] right-[6%] text-orange-700/12 dark:text-orange-400/8 animate-float">
        <OmIcon className="w-24 h-24 filter drop-shadow-sm" />
      </div>
      <div className="absolute bottom-40 left-[10%] text-amber-700/10 dark:text-amber-400/7 animate-float">
        <KalashIcon className="w-16 h-16" />
      </div>
      <div className="absolute bottom-60 right-[18%] text-orange-600/10 dark:text-orange-400/7 animate-float-delayed">
        <SwastikaIcon className="w-14 h-14" />
      </div>
      <div className="absolute bottom-24 right-[8%] text-amber-600/10 dark:text-amber-400/7 animate-float">
        <LotusIcon className="w-20 h-20" />
      </div>

      {/* Center Background Watermark */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-amber-600/[0.035] dark:text-amber-400/[0.025] scale-150">
        <OmIcon className="w-96 h-96" />
      </div>

      {/* 4. Subtle Texture Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(#d97706 1px, transparent 1px), radial-gradient(#ea580c 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      />
    </div>
  );
}

// Decorative Sacred Toran / Marigold Garland Top Border
export function SacredToranBorder() {
  return (
    <div className="w-full overflow-hidden leading-none bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 h-1 shadow-2xs" />
  );
}

// Auspicious Mantra Strip (शुभ मंत्र पट्टिका) - Zero Overlap Responsive Design
export function SacredMantraStrip() {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-gradient-to-r from-amber-950 via-orange-950 to-amber-950 text-amber-200 text-xs py-2 px-4 border-b border-amber-800/40">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4 text-center md:text-left">
        
        {/* Left: Gayatri Mantra */}
        <div className="flex items-center justify-center gap-1.5 shrink-0 max-w-full overflow-hidden">
          <span className="text-amber-400 font-bold">॥</span>
          <span className="font-semibold tracking-wide text-amber-100 font-vedic text-[11px] sm:text-xs truncate">
            {t.mantra}
          </span>
          <span className="text-amber-400 font-bold">॥</span>
        </div>

        {/* Right: Muhurat & Certification Badge */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-amber-300/90 shrink-0">
          <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>{t.muhuratText}</span>
          </span>
          <span className="text-amber-500/50 hidden sm:inline">|</span>
          <span className="text-amber-200/90 whitespace-nowrap hidden sm:inline">
            {t.verifiedAcharyaBadge}
          </span>
        </div>
      </div>
    </div>
  );
}
