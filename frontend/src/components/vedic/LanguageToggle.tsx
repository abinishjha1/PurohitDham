"use client";

import React from "react";
import { useLanguage } from "@/contexts/language-context";

interface LanguageToggleProps {
  className?: string;
  variant?: "pill" | "compact";
}

export function LanguageToggle({
  className = "",
  variant = "pill",
}: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "compact") {
    return (
      <button
        onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 dark:bg-zinc-800 dark:border-amber-700 dark:text-amber-200 transition-colors shadow-2xs ${className}`}
        title={language === "hi" ? "Switch to English" : "हिन्दी में देखें"}
        aria-label="Switch Language"
      >
        <span className="text-sm">🌐</span>
        <span>{language === "hi" ? "English" : "हिन्दी"}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl border border-amber-300/80 bg-amber-100/60 dark:bg-zinc-900 dark:border-amber-800/60 shadow-2xs ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
          language === "hi"
            ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs"
            : "text-amber-950/70 hover:text-amber-950 dark:text-amber-200/70 dark:hover:text-amber-100"
        }`}
      >
        हिन्दी
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
          language === "en"
            ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs"
            : "text-amber-950/70 hover:text-amber-950 dark:text-amber-200/70 dark:hover:text-amber-100"
        }`}
      >
        English
      </button>
    </div>
  );
}
