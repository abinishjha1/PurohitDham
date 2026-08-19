"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAdminBookings,
  updateAdminBookingStatus,
  getAdminPandits,
  assignAdminPanditToBooking,
} from "@/lib/api/admin";
import type { AdminBooking } from "@/types/admin";
import type { PanditProfile } from "@/types/pandit";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [pandits, setPandits] = useState<PanditProfile[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Assign Pandit Modal
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [selectedPanditId, setSelectedPanditId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bData, pData] = await Promise.all([
        getAdminBookings(statusFilter === "ALL" ? undefined : statusFilter),
        getAdminPandits(),
      ]);
      setBookings(bData);
      setPandits(pData);
    } catch {
      //
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateAdminBookingStatus(bookingId, newStatus);
      await loadData();
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleAssignPandit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !selectedPanditId) return;

    setIsAssigning(true);
    try {
      await assignAdminPanditToBooking(selectedBooking.id, selectedPanditId);
      setSelectedBooking(null);
      await loadData();
    } catch {
      alert("Failed to assign Pandit.");
    } finally {
      setIsAssigning(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Completed</Badge>;
      case "PANDIT_ACCEPTED":
      case "PAID":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">Confirmed</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">Pending Action</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">Cancelled</Badge>;
      default:
        return <Badge className="bg-stone-700 text-stone-300 text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Booking Orders & Status Control
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Confirm customer ceremony requests, assign lead Pandits, and track ritual completion.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {["ALL", "PENDING", "PAID", "PANDIT_ACCEPTED", "COMPLETED", "CANCELLED"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === st
                ? "bg-orange-600 text-white"
                : "bg-stone-900 text-stone-400 border border-stone-800 hover:border-stone-700"
            }`}
          >
            {st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">No bookings matching filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/60 border-b border-stone-800 text-[11px] uppercase tracking-wider text-stone-400">
                <tr>
                  <th className="py-3 px-4">Booking #</th>
                  <th className="py-3 px-4">Yajman & Ceremony</th>
                  <th className="py-3 px-4">Venue & City</th>
                  <th className="py-3 px-4">Dakshina</th>
                  <th className="py-3 px-4">Assigned Pandit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      {b.booking_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{b.puja_name}</p>
                      <p className="text-[11px] text-stone-400">
                        {b.yajman_name} {b.gotra ? `(Gotra: ${b.gotra})` : ""} • 📞 {b.customer_phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-stone-300 truncate max-w-[180px]">{b.venue_address}</p>
                      <p className="text-[11px] text-stone-500">{b.city}, {b.state}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{b.dakshina_amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.pandit_name ? (
                        <span className="text-xs text-amber-300 font-semibold">
                          🕉️ {b.pandit_name}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedBooking(b);
                            setSelectedPanditId(pandits[0]?.id || "");
                          }}
                          className="h-7 text-[11px] text-orange-400 bg-orange-500/10 hover:bg-orange-500/20"
                        >
                          + Assign Pandit
                        </Button>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {b.status === "PENDING" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(b.id, "PAID")}
                            className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                          >
                            ✓ Confirm
                          </Button>
                        )}
                        {b.status !== "COMPLETED" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(b.id, "COMPLETED")}
                            className="h-7 text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── ASSIGN PANDIT MODAL ─── */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🕉️</span>
              <span>Assign Lead Acharya to Booking</span>
            </h3>

            <p className="text-xs text-stone-400">
              Booking: <strong className="text-white">{selectedBooking.booking_number}</strong> — {selectedBooking.puja_name} in {selectedBooking.city}
            </p>

            <form onSubmit={handleAssignPandit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold">Select Pandit Ji:</label>
                <select
                  value={selectedPanditId}
                  onChange={(e) => setSelectedPanditId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-stone-800 border border-stone-700 text-white text-xs"
                >
                  {pandits.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.full_name} — {p.city} ({p.experience_years} Yrs Exp)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                  className="border-stone-700 text-stone-300 hover:bg-stone-800 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isAssigning || !selectedPanditId}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold"
                >
                  {isAssigning ? "Assigning..." : "Confirm Pandit Assignment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
