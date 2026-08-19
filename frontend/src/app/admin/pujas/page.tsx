"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getAdminPujas,
  createAdminPuja,
  updateAdminPuja,
  deleteAdminPuja,
} from "@/lib/api/admin";
import { getCategories } from "@/lib/api/pujas";
import type { PujaCategory, PujaServiceSummary } from "@/types/puja";

export default function AdminPujasPage() {
  const [pujas, setPujas] = useState<PujaServiceSummary[]>([]);
  const [categories, setCategories] = useState<PujaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPuja, setEditingPuja] = useState<PujaServiceSummary | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [subTitleHi, setSubTitleHi] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");
  const [baseDakshina, setBaseDakshina] = useState(2100);
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [icon, setIcon] = useState("🪔");
  const [badgeText, setBadgeText] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [benefit1, setBenefit1] = useState("");
  const [benefit2, setBenefit2] = useState("");

  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pData, cData] = await Promise.all([
        getAdminPujas(),
        getCategories(),
      ]);
      setPujas(pData);
      setCategories(cData);
      if (cData.length > 0 && !categoryId) {
        setCategoryId(cData[0].id);
      }
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingPuja(null);
    setName("");
    setNameHi("");
    setSlug("");
    setSubTitle("");
    setSubTitleHi("");
    setDescription("Performed by certified Vedic Acharya with pure samagri.");
    setDescriptionHi("आचार्य द्वारा शास्त्रोक्त विधि एवं शुद्ध हवन सामग्री से सम्पन्न।");
    setBaseDakshina(2100);
    setDurationMinutes(120);
    setIcon("🪔");
    setBadgeText("Popular");
    setIsPopular(true);
    setBenefit1("Spiritual peace & positive energy");
    setBenefit2("Removal of obstacles and doshas");
    setFormError("");
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: PujaServiceSummary) => {
    setEditingPuja(p);
    setName(p.name);
    setNameHi(p.name_hi);
    setSlug(p.slug);
    setCategoryId(p.category_id);
    setSubTitle(p.sub_title || "");
    setSubTitleHi(p.sub_title_hi || "");
    setDescription("Performed by certified Vedic Acharya with pure samagri.");
    setDescriptionHi("आचार्य द्वारा शास्त्रोक्त विधि एवं शुद्ध हवन सामग्री से सम्पन्न।");
    setBaseDakshina(p.base_dakshina);
    setDurationMinutes(p.duration_minutes);
    setIcon(p.icon || "🪔");
    setBadgeText(p.badge || "");
    setIsPopular(p.is_popular);
    setBenefit1(p.benefits?.[0] || "");
    setBenefit2(p.benefits?.[1] || "");
    setFormError("");
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !nameHi.trim()) {
      setFormError("Please enter both English and Hindi Puja names.");
      return;
    }

    if (!categoryId) {
      setFormError("Please select a valid Puja Category.");
      return;
    }

    const benefits = [benefit1.trim(), benefit2.trim()].filter(Boolean);

    setIsSaving(true);
    try {
      if (editingPuja) {
        // Update
        await updateAdminPuja(editingPuja.id, {
          name: name.trim(),
          name_hi: nameHi.trim(),
          sub_title: subTitle.trim() || undefined,
          sub_title_hi: subTitleHi.trim() || undefined,
          base_dakshina: Number(baseDakshina),
          duration_minutes: Number(durationMinutes),
          icon,
          badge: badgeText.trim() || undefined,
          is_popular: isPopular,
          benefits,
        });
      } else {
        // Create
        const generatedSlug = slug.trim()
          ? slug.trim().toLowerCase().replace(/\s+/g, "-")
          : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

        await createAdminPuja({
          category_id: categoryId,
          name: name.trim(),
          name_hi: nameHi.trim(),
          slug: generatedSlug,
          sub_title: subTitle.trim() || undefined,
          sub_title_hi: subTitleHi.trim() || undefined,
          description,
          description_hi: descriptionHi,
          base_dakshina: Number(baseDakshina),
          duration_minutes: Number(durationMinutes),
          icon,
          badge: badgeText.trim() || undefined,
          is_popular: isPopular,
          benefits,
          samagri_list: [
            { item: "Pure Desi Ghee & Samidha", qty: "500g" },
            { item: "Gangajal, Roli, Akshat", qty: "1 Kit" },
          ],
          vidhi_steps: [
            { step: 1, title: "Sankalp & Ganpati Pujan", desc: "Purification and Ganesh invocation" },
            { step: 2, title: "Main Ritual & Purnahuti Havan", desc: "Chanting and sacred fire offering" },
          ],
          packages: [
            { name: "Standard Vidhi", price: Number(baseDakshina), desc: "Single Pandit Ji" },
            { name: "Sampurna with Maha Havan", price: Number(baseDakshina) + 1500, desc: "2 Pandits + Grand Samagri" },
          ],
        });
      }

      setIsAddModalOpen(false);
      await loadData();
    } catch (err: any) {
      setFormError(err?.response?.data?.detail || "Failed to save Puja card.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate '${name}' from the live website?`)) {
      return;
    }
    try {
      await deleteAdminPuja(id);
      await loadData();
    } catch {
      alert("Failed to delete Puja card.");
    }
  };

  const filteredPujas = pujas.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name_hi.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Puja Cards & Catalog Control
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Add new rituals or change Dakshina prices, badges, and samagri shown on the website.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          size="sm"
          className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-4 h-9"
        >
          ➕ Add New Puja Card
        </Button>
      </div>

      {/* Search Filter */}
      <div className="max-w-xs">
        <Input
          type="text"
          placeholder="Search pujas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 bg-stone-900 border-stone-800 text-white text-xs rounded-xl focus:border-orange-500"
        />
      </div>

      {/* Pujas Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading active Puja cards...</div>
        ) : filteredPujas.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No Puja cards found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/60 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3 px-4">Puja Ceremony</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base Dakshina</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredPujas.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl p-1 rounded-lg bg-stone-800 border border-stone-700/60">
                          {p.icon || "🪔"}
                        </span>
                        <div>
                          <p className="font-bold text-white">{p.name}</p>
                          <p className="text-[11px] text-orange-400">{p.name_hi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      {p.category_name || "Vedic Ritual"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{p.base_dakshina.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      ⏱ {p.duration_minutes} Mins
                    </td>
                    <td className="py-3.5 px-4">
                      {p.badge ? (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px]">
                          {p.badge}
                        </Badge>
                      ) : (
                        <span className="text-stone-500">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(p)}
                          className="h-8 text-xs text-orange-400 hover:text-white hover:bg-stone-800"
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id, p.name)}
                          className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-stone-800"
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── ADD / EDIT MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🪔</span>
                <span>{editingPuja ? `Edit Puja: ${editingPuja.name}` : "Add New Puja Card to Website"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300">
                ⚠ {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-stone-300">Puja Name (English) *</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Navgraha Shanti Havan"
                    required
                    className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-stone-300">Puja Name (Hindi) *</Label>
                  <Input
                    type="text"
                    value={nameHi}
                    onChange={(e) => setNameHi(e.target.value)}
                    placeholder="e.g. नवग्रह शांति एवं महा हवन"
                    required
                    className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>
              </div>

              {!editingPuja && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-stone-300">Category *</Label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.name_hi})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-stone-300">URL Slug</Label>
                    <Input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. navgraha-shanti-havan"
                      className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-stone-300">Base Dakshina (₹) *</Label>
                  <Input
                    type="number"
                    value={baseDakshina}
                    onChange={(e) => setBaseDakshina(Number(e.target.value))}
                    required
                    min={100}
                    className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-stone-300">Duration (Minutes)</Label>
                  <Input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={15}
                    className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-stone-300">Icon Emoji</Label>
                  <Input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="🪔"
                    className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-stone-300">Card Badge (e.g. Most Popular)</Label>
                  <Input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="Most Booked"
                    className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-stone-300">Subtitle / Tagline</Label>
                  <Input
                    type="text"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    placeholder="Complete Vedic Hawan vidhi"
                    className="h-9 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-stone-300">Key Benefits</Label>
                <div className="space-y-1.5">
                  <Input
                    type="text"
                    value={benefit1}
                    onChange={(e) => setBenefit1(e.target.value)}
                    placeholder="Benefit 1 (e.g. Brings prosperity and positive vastu vibrations)"
                    className="h-8 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                  <Input
                    type="text"
                    value={benefit2}
                    onChange={(e) => setBenefit2(e.target.value)}
                    placeholder="Benefit 2 (e.g. Calms malefic planetary influences)"
                    className="h-8 bg-stone-800 border-stone-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-stone-700 text-stone-300 hover:bg-stone-800 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold px-6"
                >
                  {isSaving ? "Saving Card..." : "Save & Update Website"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
