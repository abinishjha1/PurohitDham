"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type Language, type Translations, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isHindi: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("hi"); // Default to Hindi for authentic Sanatan feel

  // Load persisted language from localStorage on client mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("purohitdham_lang") as Language | null;
      if (savedLang && (savedLang === "hi" || savedLang === "en")) {
        setLanguageState(savedLang);
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("purohitdham_lang", lang);
    } catch {
      // Ignore localStorage write errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "hi" ? "en" : "hi");
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isHindi: language === "hi",
        isEnglish: language === "en",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
