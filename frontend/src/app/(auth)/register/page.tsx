"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onboardPandit } from "@/lib/api/pandits";

const AVAILABLE_PUJAS = [
  { slug: "griha-pravesh-puja", label: "Griha Pravesh & Vastu (गृह प्रवेश)" },
  { slug: "satyanarayan-katha", label: "Satyanarayan Katha (सत्यनारायण कथा)" },
  { slug: "maha-rudrabhishek-puja", label: "Maha Rudrabhishek (रुद्राभिषेक)" },
  { slug: "navgraha-shanti-havan", label: "Navgraha Shanti & Havan (नवग्रह शांति)" },
  { slug: "vedic-vivah-sanskar", label: "Vivah Sanskar (विवाह संस्कार)" },
  { slug: "mahamrityunjaya-japa-havan", label: "Maha Mrityunjaya Japa (महामृत्युंजय)" },
  { slug: "namkaran-sanskar", label: "Namkaran Sanskar (नामकरण)" },
  { slug: "sunderkand-path", label: "Sunderkand Path (सुंदरकांड)" },
  { slug: "kaal-sarp-dosh-nivaran", label: "Kaal Sarp Dosh Shanti (कालसर्प दोष)" },
  { slug: "laxmi-kuber-puja", label: "Laxmi-Kuber Puja (लक्ष्मी कुबेर)" },
  { slug: "mundan-sanskar", label: "Mundan Sanskar (मुंडन संस्कार)" },
  { slug: "yagnopavit-janeu", label: "Janeu Sanskar (यज्ञोपवीत)" },
  { slug: "pitra-dosh-shradh", label: "Pitra Dosh & Shradh (पितृ श्राद्ध)" },
  { slug: "durga-saptashati-chandi-path", label: "Chandi Path (चंडी पाठ)" },
  { slug: "vastu-shanti-havan", label: "Vastu Shanti (वास्तु शांति)" },
  { slug: "office-inauguration-puja", label: "Office Inauguration (दुकान उद्घाटन)" },
];

const AVAILABLE_LANGUAGES = [
  "Hindi (हिन्दी)",
  "Sanskrit (संस्कृतम्)",
  "English",
  "Maithili (मैथिली)",
  "Bhojpuri (भोजपुरी)",
  "Gujarati (ગુજરાતી)",
  "Marathi (मराठी)",
  "Bengali (বাংলা)",
  "Telugu (తెలుగు)",
  "Tamil (தமிழ்)",
  "Kannada (ಕನ್ನಡ)",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin } = useAuth();

  // Basic Account State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole.CUSTOMER | UserRole.PANDIT>(UserRole.CUSTOMER);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pandit-Specific State
  const [title, setTitle] = useState("Acharya");
  const [gurukulName, setGurukulName] = useState("");
  const [educationDegree, setEducationDegree] = useState("Acharya (M.A. Sanskrit)");
  const [experienceYears, setExperienceYears] = useState(5);
  const [vedicLineage, setVedicLineage] = useState("Shukla Yajurveda (शुक्ल यजुर्वेद)");
  const [bio, setBio] = useState("");
  const [selectedPujas, setSelectedPujas] = useState<string[]>([
    "griha-pravesh-puja",
    "satyanarayan-katha",
    "maha-rudrabhishek-puja",
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "Hindi (हिन्दी)",
    "Sanskrit (संस्कृतम्)",
  ]);

  // Address & GPS
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(25);
  const [gpsStatus, setGpsStatus] = useState<string>("");

  // Validation functions
  const isValidEmail = (val: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
  };

  const isValidPhone = (val: string) => {
    return /^[6-9]\d{9}$/.test(val.trim());
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(cleaned);
  };

  const togglePuja = (slug: string) => {
    setSelectedPujas((prev) =>
      prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // Live GPS Detector
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus("GPS Geolocation is not supported by your browser.");
      return;
    }
    setGpsStatus("Detecting satellite coordinates...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsStatus(
          `✓ GPS Coordinates Locked: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        );
      },
      (err) => {
        setGpsStatus(`GPS Notice: ${err.message}. You can continue with manual address.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Common validations
    if (!fullName.trim()) {
      setError("Please enter your Full Name.");
      return;
    }

    if (!phone.trim() || !isValidPhone(phone)) {
      setError("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Pandit validations
    if (role === UserRole.PANDIT) {
      if (!gurukulName.trim()) {
        setError("Please enter your Gurukul / Sanskrit University name.");
        return;
      }
      if (selectedPujas.length === 0) {
        setError("Please select at least 1 Puja you can perform.");
        return;
      }
      if (selectedLanguages.length === 0) {
        setError("Please select at least 1 language you can chant mantras in.");
        return;
      }
      if (!streetAddress.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
        setError("Please fill all mandatory address fields.");
        return;
      }
    }

    setIsLoading(true);

    try {
      // 1. Create User Account
      await register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        role,
      });

      // 2. If Pandit, immediately onboard profile with GPS and Specializations
      if (role === UserRole.PANDIT) {
        await onboardPandit({
          title,
          gurukul_name: gurukulName.trim(),
          education_degree: educationDegree,
          experience_years: Number(experienceYears),
          vedic_lineage: vedicLineage,
          bio: bio.trim() || undefined,
          specializations: selectedPujas,
          languages: selectedLanguages,
          street_address: streetAddress.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          latitude,
          longitude,
          service_radius_km: Number(serviceRadiusKm),
        });
        router.push("/pandits");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      if (typeof window !== "undefined" && (window as any).google?.accounts) {
        const client = (window as any).google.accounts.id;
        client.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: async (response: any) => {
            try {
              setIsLoading(true);
              await googleLogin({ id_token: response.credential, role });
              if (role === UserRole.PANDIT) {
                router.push("/pandit/onboard");
              } else {
                router.push("/");
              }
            } catch (err: any) {
              const msg = err?.response?.data?.detail || "Google sign-up failed.";
              setError(msg);
            } finally {
              setIsLoading(false);
            }
          },
        });
        client.prompt();
      } else {
        setError("Google Sign-In is not initialized. Please register with email.");
      }
    } catch {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <>
      {/* Google Identity Services script */}
      <script src="https://accounts.google.com/gsi/client" async defer />

      <div className={`w-full transition-all duration-300 ${role === UserRole.PANDIT ? "max-w-[620px]" : "max-w-[450px]"}`}>
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-900/5 border border-stone-200/80 overflow-hidden">
          {/* Top Royal Vedic Accent Bar */}
          <div className="h-1 bg-gradient-to-r from-red-800 via-amber-500 to-orange-600" />

          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 border border-orange-200/80 mb-2">
                <span className="text-xl">{role === UserRole.PANDIT ? "🕉️" : "🪔"}</span>
              </div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                {role === UserRole.PANDIT ? "Pandit Ji Complete Registration" : "Create an Account"}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {role === UserRole.PANDIT
                  ? "Register as an Acharya with GPS Location, Education & Puja Skills"
                  : "Join Purohitdham for trusted Vedic & Puja services"}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-3.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <span className="shrink-0 font-bold">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Role Selector Tabs */}
            <div className="mb-4">
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl border border-stone-200/60">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.CUSTOMER)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    role === UserRole.CUSTOMER
                      ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <span>🙏</span>
                  <span>Yajman (Customer)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.PANDIT)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    role === UserRole.PANDIT
                      ? "bg-white text-stone-900 shadow-sm border border-stone-200/80"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <span>🕉️</span>
                  <span>Pandit Ji</span>
                </button>
              </div>
            </div>

            {/* Google sign up button (for Customer or quick signup) */}
            {role === UserRole.CUSTOMER && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </button>

                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    or email
                  </span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
              </>
            )}

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              {/* ── SECTION 1: BASIC ACCOUNT CREDENTIALS ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                    1. Account & Contact Details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="reg-name" className="text-xs font-semibold text-stone-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reg-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoComplete="off"
                      className="h-9.5 rounded-lg border-stone-300 bg-white text-xs text-stone-900 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-phone" className="text-xs font-semibold text-stone-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-phone"
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                        maxLength={10}
                        autoComplete="off"
                        className={`h-9.5 rounded-lg border bg-white text-xs text-stone-900 ${
                          phone.length === 10 && isValidPhone(phone)
                            ? "border-emerald-400"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      {phone.length === 10 && isValidPhone(phone) && (
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="reg-email" className="text-xs font-semibold text-stone-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                      className={`h-9.5 rounded-lg border bg-white text-xs text-stone-900 ${
                        email.length > 0 && isValidEmail(email)
                          ? "border-emerald-400"
                          : "border-stone-300 focus:border-orange-500"
                      }`}
                    />
                    {email.length > 0 && isValidEmail(email) && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="reg-password" className="text-xs font-semibold text-stone-700">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="h-9.5 rounded-lg border-stone-300 bg-white text-xs text-stone-900 focus:border-orange-500 pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                        tabIndex={-1}
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-confirm-password" className="text-xs font-semibold text-stone-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="reg-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className={`h-9.5 rounded-lg border bg-white text-xs text-stone-900 pr-8 ${
                          confirmPassword && confirmPassword === password
                            ? "border-emerald-400"
                            : "border-stone-300 focus:border-orange-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── SECTIONS 2, 3, 4: ONLY FOR PANDIT JI ── */}
              {role === UserRole.PANDIT && (
                <>
                  {/* ── SECTION 2: VEDIC QUALIFICATIONS ── */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                        2. Vedic Education & Experience
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-stone-700">Title</Label>
                        <select
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full h-9.5 px-2 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 focus:border-orange-500"
                        >
                          <option>Acharya (आचार्य)</option>
                          <option>Shastri (शास्त्री)</option>
                          <option>Veda Murti (वेदमूर्ति)</option>
                          <option>Pandit Ji (पंडित जी)</option>
                        </select>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs font-semibold text-stone-700">
                          Degree / Qualification <span className="text-red-500">*</span>
                        </Label>
                        <select
                          value={educationDegree}
                          onChange={(e) => setEducationDegree(e.target.value)}
                          className="w-full h-9.5 px-2 rounded-lg border border-stone-300 bg-white text-xs text-stone-900 focus:border-orange-500"
                        >
                          <option>Acharya (M.A. Sanskrit / Karmakand)</option>
                          <option>Shastri (B.A. Sanskrit)</option>
                          <option>Karmakand Certified (कर्मकाण्ड विशारद)</option>
                          <option>Ved Pathi (वेद पाठी)</option>
                          <option>Jyotish Acharya (ज्योतिष आचार्य)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-stone-700">
                          Gurukul / Sanskrit University <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          value={gurukulName}
                          onChange={(e) => setGurukulName(e.target.value)}
                          placeholder="e.g. Sampurnanand Vishwavidyalaya"
                          required
                          className="h-9.5 rounded-lg border-stone-300 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-stone-700">
                          Years of Experience: <span className="text-orange-600 font-bold">{experienceYears} Yrs</span>
                        </Label>
                        <input
                          type="range"
                          min={1}
                          max={40}
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full accent-orange-600 mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── SECTION 3: PUJA SPECIALIZATIONS (MULTI-SELECT) ── */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                        3. Puja Skills & Rituals ({selectedPujas.length} Selected) <span className="text-red-500">*</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2.5 rounded-xl border border-stone-200 bg-stone-50/50">
                      {AVAILABLE_PUJAS.map((p) => {
                        const isChecked = selectedPujas.includes(p.slug);
                        return (
                          <label
                            key={p.slug}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? "bg-orange-50 border-orange-400 text-orange-950 font-semibold"
                                : "bg-white border-stone-200 text-stone-700 hover:border-stone-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePuja(p.slug)}
                              className="w-3.5 h-3.5 rounded text-orange-600 accent-orange-600"
                            />
                            <span className="truncate">{p.label}</span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Languages */}
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-stone-700">
                        Languages Spoken: <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_LANGUAGES.map((l) => {
                          const isSelected = selectedLanguages.includes(l);
                          return (
                            <button
                              key={l}
                              type="button"
                              onClick={() => toggleLanguage(l)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                                isSelected
                                  ? "bg-stone-900 text-white border-stone-900"
                                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                              }`}
                            >
                              {isSelected ? "✓ " : "+ "}
                              {l}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── SECTION 4: ADDRESS & LIVE GPS DETECTION ── */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                        4. Address & GPS Geolocation <span className="text-red-500">*</span>
                      </span>
                    </div>

                    {/* GPS Button Box */}
                    <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-orange-950 block">
                          📍 Auto-Detect Home Location (GPS)
                        </span>
                        <p className="text-[10px] text-orange-800/70">
                          Locks coordinates for automated booking matching in your area.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={detectLocation}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shrink-0 h-8"
                      >
                        📍 Detect GPS
                      </Button>
                    </div>

                    {gpsStatus && (
                      <p className="text-[10px] font-semibold text-orange-900 bg-white p-2 rounded-lg border border-orange-200">
                        {gpsStatus}
                      </p>
                    )}

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-stone-700">
                        Street / Area Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="House No, Mandir Marg, Locality"
                        required
                        className="h-9.5 rounded-lg border-stone-300 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-stone-700">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Varanasi / Delhi"
                          required
                          className="h-9.5 rounded-lg border-stone-300 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-stone-700">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Uttar Pradesh"
                          required
                          className="h-9.5 rounded-lg border-stone-300 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-stone-700">
                          Pin Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="221001"
                          required
                          maxLength={6}
                          className="h-9.5 rounded-lg border-stone-300 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-stone-700">
                        Travel Service Radius: <span className="text-orange-600 font-bold">{serviceRadiusKm} KM</span>
                      </Label>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={serviceRadiusKm}
                        onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                        className="w-full accent-orange-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition-all disabled:opacity-50 text-xs mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    {role === UserRole.PANDIT ? "Registering Pandit Profile..." : "Creating Account..."}
                  </span>
                ) : role === UserRole.PANDIT ? (
                  "🕉️ Complete Pandit Registration"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-stone-50 border-t border-stone-200/80 text-center">
            <p className="text-xs text-stone-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
