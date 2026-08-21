"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/types/auth";
import { LanguageToggle } from "@/components/vedic/LanguageToggle";

/**
 * Shared public site header — sticky glass bar with the Purohitdham brand mark,
 * primary navigation, the Hindi/English toggle, and auth-aware actions.
 * Used across every public page so the whole site shares one chrome.
 */
export function SiteHeader() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPandit = hasRole(UserRole.PANDIT);
  const isAdmin = hasRole(UserRole.ADMIN, UserRole.SUPER_ADMIN);

  const navLinks = [
    { href: "/pujas", label: language === "hi" ? "पूजा सूची" : "All Pujas" },
    { href: "/pandits", label: language === "hi" ? "पंडित खोजें" : "Find Pandits" },
    { href: "/#how-it-works", label: t.navHowItWorks },
    { href: "/#faq", label: t.navFaq },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-orange-600 text-xl sm:text-2xl font-bold leading-none">ॐ</span>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-amber-950">
            {language === "hi" ? (
              <>पुरोहित<span className="text-orange-600">धाम</span></>
            ) : (
              <>Purohit<span className="text-orange-600">dham</span></>
            )}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-amber-900/70">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-orange-600 transition-colors">
              {item.label}
            </Link>
          ))}
          {/* Role-based nav links */}
          {isPandit && (
            <Link
              href="/pandit/onboard"
              className="hover:text-orange-600 transition-colors text-orange-700 font-semibold"
            >
              {language === "hi" ? "🙏 मेरा डैशबोर्ड" : "🙏 My Dashboard"}
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-orange-600 transition-colors text-orange-700 font-semibold"
            >
              {language === "hi" ? "⚙️ एडमिन पैनल" : "⚙️ Admin Panel"}
            </Link>
          )}
          {!isPandit && !isAdmin && (
            <Link
              href="/pandit/onboard"
              className="hover:text-orange-600 transition-colors text-orange-700 font-semibold"
            >
              {language === "hi" ? "पंडित पंजीकरण" : "Join as Pandit"}
            </Link>
          )}
        </nav>

        {/* Right: Language + Auth + Mobile toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-amber-800 font-medium truncate max-w-[120px]">
                🙏 {user?.full_name?.split(" ")[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="text-xs border-amber-200 text-amber-800 hover:bg-amber-50"
              >
                {language === "hi" ? "लॉगआउट" : "Logout"}
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-amber-200 text-amber-800 hover:bg-amber-50"
                >
                  {language === "hi" ? "लॉगिन" : "Login"}
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="text-xs bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold shadow-sm"
                >
                  {language === "hi" ? "रजिस्टर" : "Sign Up"}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-medium text-amber-900 hover:bg-amber-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {isPandit && (
              <Link
                href="/pandit/onboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-semibold text-orange-700 hover:bg-amber-50 transition-colors"
              >
                {language === "hi" ? "🙏 मेरा डैशबोर्ड" : "🙏 My Dashboard"}
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-semibold text-orange-700 hover:bg-amber-50 transition-colors"
              >
                {language === "hi" ? "⚙️ एडमिन पैनल" : "⚙️ Admin Panel"}
              </Link>
            )}
            {!isPandit && !isAdmin && (
              <Link
                href="/pandit/onboard"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-sm font-semibold text-orange-700 hover:bg-amber-50 transition-colors"
              >
                {language === "hi" ? "पंडित पंजीकरण" : "Join as Pandit"}
              </Link>
            )}
            <Separator className="my-2 bg-amber-100" />
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <span className="px-3 text-sm text-amber-800">🙏 {user?.full_name}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="border-amber-200 text-amber-800"
                >
                  {language === "hi" ? "लॉगआउट" : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-amber-200 text-amber-800">
                    {language === "hi" ? "लॉगिन" : "Login"}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold">
                    {language === "hi" ? "रजिस्टर करें" : "Create Account"}
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
