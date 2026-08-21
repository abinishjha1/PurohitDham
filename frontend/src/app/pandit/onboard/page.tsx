"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onboardPandit } from "@/lib/api/pandits";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const AVAILABLE_PUJAS = [
  { slug: "griha-pravesh-puja", label: "Griha Pravesh & Vastu Shanti (गृह प्रवेश)" },
  { slug: "satyanarayan-katha", label: "Satyanarayan Maha Katha (सत्यनारायण कथा)" },
  { slug: "maha-rudrabhishek-puja", label: "Maha Rudrabhishek (रुद्राभिषेक)" },
  { slug: "navgraha-shanti-havan", label: "Navgraha Shanti & Havan (नवग्रह शांति)" },
  { slug: "vedic-vivah-sanskar", label: "Vedic Vivah Sanskar (विवाह संस्कार)" },
  { slug: "mahamrityunjaya-japa-havan", label: "Maha Mrityunjaya Japa (महामृत्युंजय जप)" },
  { slug: "namkaran-sanskar", label: "Namkaran Sanskar (नामकरण संस्कार)" },
  { slug: "sunderkand-path", label: "Sunderkand Path (सुंदरकांड पाठ)" },
  { slug: "kaal-sarp-dosh-nivaran", label: "Kaal Sarp Dosh Shanti (कालसर्प दोष)" },
  { slug: "laxmi-kuber-puja", label: "Laxmi-Kuber Dhan Vriddhi (लक्ष्मी-कुबेर पूजा)" },
  { slug: "mundan-sanskar", label: "Mundan Sanskar (मुंडन संस्कार)" },
  { slug: "yagnopavit-janeu", label: "Yagnopavit / Janeu Sanskar (यज्ञोपवीत संस्कार)" },
  { slug: "pitra-dosh-shradh", label: "Pitra Dosh & Shradh Vidhi (पितृ दोष एवं श्राद्ध)" },
  { slug: "durga-saptashati-chandi-path", label: "Durga Saptashati / Chandi Path (चंडी पाठ)" },
  { slug: "vastu-shanti-havan", label: "Vastu Dosh Nivaran Havan (वास्तु शांति हवन)" },
  { slug: "bhoomi-pujan", label: "Bhoomi Pujan & Foundation (भूमि पूजन)" },
  { slug: "office-inauguration-puja", label: "Office / Shop Inauguration (दुकान/कार्यालय उद्घाटन)" },
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

export default function PanditOnboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("Acharya");
  const [gurukulName, setGurukulName] = useState("");
  const [educationDegree, setEducationDegree] = useState("Acharya (M.A. Sanskrit)");
  const [experienceYears, setExperienceYears] = useState(5);
  const [vedicLineage, setVedicLineage] = useState("Shukla Yajurveda (शुक्ल यजुर्वेद)");
  const [bio, setBio] = useState("");

  // Specializations & Languages
  const [selectedPujas, setSelectedPujas] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["Hindi (हिन्दी)", "Sanskrit (संस्कृतम्)"]);

  // Address & GPS
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(25);
  const [gpsStatus, setGpsStatus] = useState<string>("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // GPS Geolocation Handler
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
        setGpsStatus(`✓ GPS Location Detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setGpsStatus(`GPS Error: ${err.message}. You can still proceed with manual address.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedPujas.length === 0) {
      setError("Please select at least 1 Puja specialization.");
      return;
    }

    if (selectedLanguages.length === 0) {
      setError("Please select at least 1 language you can recite mantras in.");
      return;
    }

    if (!gurukulName.trim() || !streetAddress.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setError("Please fill all mandatory address and education fields.");
      return;
    }

    setIsLoading(true);

    try {
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
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Onboarding failed. Please ensure you are logged in.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30 text-amber-950 flex flex-col">
      <SiteHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-amber-900/5 border border-amber-100 overflow-hidden">
          {/* Saffron & Maroon Top Accent */}
          <div className="h-1.5 bg-gradient-to-r from-red-800 via-amber-500 to-orange-600" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 border border-orange-200 mb-2">
                <span className="text-2xl">🕉️</span>
              </div>
              <h1 className="text-2xl font-bold text-amber-900 tracking-tight">
                Vedic Pandit Registration & Onboarding
              </h1>
              <p className="text-xs text-amber-600 mt-1">
                Join India&apos;s most trusted network of verified Gurukul-trained Acharyas
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-8 px-4">
              {[
                { num: 1, label: "Education & Bio" },
                { num: 2, label: "Puja Skills & Languages" },
                { num: 3, label: "Address & GPS Location" },
              ].map((s) => (
                <div
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    step === s.num ? "text-orange-600 font-bold" : "text-amber-500 font-medium"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1 transition-all ${
                      step >= s.num
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-amber-100 text-amber-600 border border-amber-100"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span className="text-[11px] hidden sm:block">{s.label}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <span className="shrink-0 font-bold">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── STEP 1: EDUCATION & BIO ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-amber-800">Honorific Title</Label>
                      <select
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-amber-200 bg-white text-xs text-amber-900 focus:border-orange-500 focus:ring-orange-500/20"
                      >
                        <option>Acharya (आचार्य)</option>
                        <option>Shastri (शास्त्री)</option>
                        <option>Veda Murti (वेदमूर्ति)</option>
                        <option>Pandit Ji (पंडित जी)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-amber-800">
                        Vedic Lineage / Veda Branch <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={vedicLineage}
                        onChange={(e) => setVedicLineage(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-amber-200 bg-white text-xs text-amber-900 focus:border-orange-500 focus:ring-orange-500/20"
                      >
                        <option>Shukla Yajurveda (शुक्ल यजुर्वेद - माध्यन्दिन शाखा)</option>
                        <option>Krishna Yajurveda (कृष्ण यजुर्वेद - तैत्तिरीय शाखा)</option>
                        <option>Rigveda (ऋग्वेद - शाकल शाखा)</option>
                        <option>Samaveda (सामवेद - कौथुम शाखा)</option>
                        <option>Atharvaveda (अथर्ववेद - शौनक शाखा)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-amber-800">
                        Gurukul / Sanskrit University <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={gurukulName}
                        onChange={(e) => setGurukulName(e.target.value)}
                        placeholder="e.g. Sampurnanand Sanskrit Vishwavidyalaya, Varanasi"
                        required
                        className="h-10 rounded-lg border-amber-200 text-xs focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-amber-800">
                        Degree / Qualification <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={educationDegree}
                        onChange={(e) => setEducationDegree(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-amber-200 bg-white text-xs text-amber-900 focus:border-orange-500 focus:ring-orange-500/20"
                      >
                        <option>Acharya (M.A. Sanskrit / Karmakand)</option>
                        <option>Shastri (B.A. Sanskrit)</option>
                        <option>Karmakand Certified (कर्मकाण्ड विशारद)</option>
                        <option>Ved Pathi (वेद पाठी)</option>
                        <option>Jyotish Acharya (ज्योतिष आचार्य)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-amber-800">
                      Years of Vedic Ritual Experience: <span className="font-bold text-orange-600">{experienceYears} Years</span>
                    </Label>
                    <input
                      type="range"
                      min={1}
                      max={40}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full accent-orange-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-amber-800">Short Bio / About Your Experience</Label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share a brief introduction about your Gurukul training, expertise in Hawan, and dedication to Vedic traditions..."
                      className="w-full p-2.5 rounded-lg border border-amber-200 text-xs text-amber-900 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="button" onClick={() => setStep(2)} className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-6 h-10">
                      Next: Select Puja Skills →
                    </Button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: PUJA SKILLS & LANGUAGES ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <Label className="text-xs font-bold text-amber-800 block mb-1">
                      Select All Pujas & Rituals You Can Perform: <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-[11px] text-amber-600 mb-3">
                      Select all ceremonies you are qualified to perform as the lead Purohit ({selectedPujas.length} Selected)
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                      {AVAILABLE_PUJAS.map((p) => {
                        const isChecked = selectedPujas.includes(p.slug);
                        return (
                          <label
                            key={p.slug}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? "bg-orange-50 border-orange-400 text-orange-950 font-semibold"
                                : "bg-white border-amber-100 text-amber-800 hover:border-amber-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePuja(p.slug)}
                              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 accent-orange-600"
                            />
                            <span>{p.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-amber-800 block mb-1">
                      Languages Spoken / Mantra Chanting: <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {AVAILABLE_LANGUAGES.map((l) => {
                        const isSelected = selectedLanguages.includes(l);
                        return (
                          <button
                            key={l}
                            type="button"
                            onClick={() => toggleLanguage(l)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              isSelected
                                ? "bg-amber-900 text-white border-amber-900 shadow-xs"
                                : "bg-white text-amber-700 border-amber-100 hover:border-amber-200"
                            }`}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {l}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-amber-100">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="text-xs">
                      ← Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)} className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-6 h-10">
                      Next: Address & GPS →
                    </Button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: ADDRESS & GPS LOCATION ── */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* GPS Detection Box */}
                  <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                          <span>📍</span>
                          <span>Auto-Detect Home GPS Location</span>
                        </h4>
                        <p className="text-[11px] text-orange-800/70 mt-0.5">
                          Enables instant nearby Puja alerts when Yajmans book in your local radius.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={detectLocation}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shrink-0"
                      >
                        📍 Detect GPS
                      </Button>
                    </div>

                    {gpsStatus && (
                      <p className="text-[11px] font-semibold text-orange-900 mt-2 bg-white/70 p-2 rounded-lg border border-orange-200">
                        {gpsStatus}
                      </p>
                    )}
                  </div>

                  {/* Manual Address Fields */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-amber-800">
                      Street / House Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="House No., Street / Mandir Lane, Area"
                      required
                      className="h-10 rounded-lg border-amber-200 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-amber-800">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Varanasi / Delhi"
                        required
                        className="h-10 rounded-lg border-amber-200 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-amber-800">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="e.g. Uttar Pradesh"
                        required
                        className="h-10 rounded-lg border-amber-200 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-amber-800">
                        Pin Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 221001"
                        required
                        maxLength={6}
                        className="h-10 rounded-lg border-amber-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <Label className="text-xs font-semibold text-amber-800">
                      Service Travel Radius: <span className="font-bold text-orange-600">{serviceRadiusKm} KM</span>
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

                  <div className="flex justify-between pt-4 border-t border-amber-100">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="text-xs">
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs px-8 h-10 shadow-md shadow-orange-600/20"
                    >
                      {isLoading ? "Submitting Application..." : "🕉️ Complete Pandit Registration"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
