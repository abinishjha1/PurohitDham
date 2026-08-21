"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (val: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(language === "hi" ? "कृपया अपना ईमेल पता दर्ज करें।" : "Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setError(language === "hi" ? "कृपया एक मान्य ईमेल पता दर्ज करें।" : "Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError(language === "hi" ? "कृपया अपना पासवर्ड दर्ज करें।" : "Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ email: email.trim().toLowerCase(), password });
      // Role-based redirect after login
      const userRole = response.user.role;
      if (userRole === UserRole.PANDIT) {
        router.push("/pandit/onboard");
      } else if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        (language === "hi"
          ? "लॉगिन असफल रहा। कृपया अपनी जानकारी जाँचें।"
          : "Login failed. Please check your credentials.");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      if (typeof window !== "undefined" && (window as any).google?.accounts) {
        const client = (window as any).google.accounts.id;
        client.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: async (response: any) => {
            try {
              setIsLoading(true);
              await googleLogin({ id_token: response.credential, role: "CUSTOMER" });
              router.push("/");
            } catch (err: any) {
              const msg =
                err?.response?.data?.detail ||
                (language === "hi" ? "Google लॉगिन असफल रहा।" : "Google login failed.");
              setError(msg);
            } finally {
              setIsLoading(false);
            }
          },
        });
        client.prompt();
      } else {
        setError(
          language === "hi"
            ? "Google साइन-इन तैयार नहीं है। कृपया ईमेल से लॉगिन करें।"
            : "Google Sign-In is not initialized. Please try email login."
        );
      }
    } catch {
      setError(
        language === "hi"
          ? "Google साइन-इन असफल रहा। कृपया पुनः प्रयास करें।"
          : "Google Sign-In failed. Please try again."
      );
    }
  };

  return (
    <>
      {/* Google Identity Services script */}
      <script src="https://accounts.google.com/gsi/client" async defer />

      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-amber-900/5 border border-amber-100 overflow-hidden">
          {/* Top Royal Vedic Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-red-800 via-amber-500 to-orange-600" />

          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 border border-orange-200/80 mb-2">
                <span className="text-xl">🪔</span>
              </div>
              <h1 className="text-xl font-bold text-amber-950 tracking-tight">
                {language === "hi" ? "पुनः स्वागत है" : "Welcome Back"}
              </h1>
              <p className="text-xs text-amber-600 mt-0.5">
                {language === "hi"
                  ? "अपने पुरोहितधाम खाते में साइन इन करें"
                  : "Sign in to your Purohitdham account"}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-3.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <span className="shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Google login button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-xs font-semibold text-amber-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {language === "hi" ? "Google से जारी रखें" : "Continue with Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-px bg-amber-200" />
              <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">
                {language === "hi" ? "अथवा ईमेल" : "or email"}
              </span>
              <div className="flex-1 h-px bg-amber-200" />
            </div>

            {/* Email/Password form */}
            <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
              <div className="space-y-1">
                <Label
                  htmlFor="login-email"
                  className="text-xs font-semibold text-amber-800"
                >
                  {language === "hi" ? "ईमेल पता" : "Email Address"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="h-9.5 rounded-lg border-amber-200 bg-white text-xs text-amber-950 focus:border-orange-500 focus:ring-orange-500/20"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="login-password"
                    className="text-xs font-semibold text-amber-800"
                  >
                    {language === "hi" ? "पासवर्ड" : "Password"} <span className="text-red-500">*</span>
                  </Label>
                  <button
                    type="button"
                    className="text-[11px] text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    {language === "hi" ? "पासवर्ड भूल गए?" : "Forgot password?"}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-9.5 rounded-lg border-amber-200 bg-white text-xs text-amber-950 focus:border-orange-500 focus:ring-orange-500/20 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors p-1"
                    tabIndex={-1}
                    aria-label={
                      showPassword
                        ? language === "hi" ? "पासवर्ड छिपाएँ" : "Hide password"
                        : language === "hi" ? "पासवर्ड दिखाएँ" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-10 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all disabled:opacity-50 text-xs mt-1"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    {language === "hi" ? "साइन इन हो रहा है..." : "Signing in..."}
                  </span>
                ) : (
                  language === "hi" ? "साइन इन करें" : "Sign In"
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 text-center">
            <p className="text-xs text-amber-700">
              {language === "hi" ? "खाता नहीं है?" : "Don't have an account?"}{" "}
              <Link
                href="/register"
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                {language === "hi" ? "खाता बनाएँ" : "Create Account"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
