/**
 * Master Admin API Client functions
 */

import apiClient from "./client";
import type {
  AdminBooking,
  AdminCreatePujaPayload,
  AdminStats,
  AdminUpdatePujaPayload,
  AdminUser,
} from "@/types/admin";
import type { PujaServiceDetail, PujaServiceSummary } from "@/types/puja";
import type { PanditProfile } from "@/types/pandit";

export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<AdminStats>("/admin/stats");
  return response.data;
}

// ─── Puja Management ───
export async function getAdminPujas(): Promise<PujaServiceSummary[]> {
  const response = await apiClient.get<PujaServiceSummary[]>("/admin/pujas");
  return response.data;
}

export async function createAdminPuja(
  data: AdminCreatePujaPayload
): Promise<PujaServiceDetail> {
  const response = await apiClient.post<PujaServiceDetail>("/admin/pujas", data);
  return response.data;
}

export async function updateAdminPuja(
  id: string,
  data: AdminUpdatePujaPayload
): Promise<PujaServiceDetail> {
  const response = await apiClient.put<PujaServiceDetail>(`/admin/pujas/${id}`, data);
  return response.data;
}

export async function deleteAdminPuja(id: string): Promise<void> {
  await apiClient.delete(`/admin/pujas/${id}`);
}

// ─── Pandit Management ───
export async function getAdminPandits(): Promise<PanditProfile[]> {
  const response = await apiClient.get<PanditProfile[]>("/admin/pandits");
  return response.data;
}

export async function toggleAdminPanditVerify(
  id: string
): Promise<PanditProfile> {
  const response = await apiClient.patch<PanditProfile>(
    `/admin/pandits/${id}/verify`
  );
  return response.data;
}

// ─── Booking Management ───
export async function getAdminBookings(status?: string): Promise<AdminBooking[]> {
  const response = await apiClient.get<AdminBooking[]>("/admin/bookings", {
    params: { status_filter: status || undefined },
  });
  return response.data;
}

export async function updateAdminBookingStatus(
  id: string,
  status: string,
  admin_notes?: string
): Promise<AdminBooking> {
  const response = await apiClient.patch<AdminBooking>(
    `/admin/bookings/${id}/status`,
    { status, admin_notes }
  );
  return response.data;
}

export async function assignAdminPanditToBooking(
  bookingId: string,
  panditId: string
): Promise<AdminBooking> {
  const response = await apiClient.patch<AdminBooking>(
    `/admin/bookings/${bookingId}/assign`,
    { pandit_id: panditId }
  );
  return response.data;
}

// ─── User Management ───
export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await apiClient.get<AdminUser[]>("/admin/users");
  return response.data;
}

export async function updateAdminUserRole(
  userId: string,
  newRole: string
): Promise<void> {
  await apiClient.patch(`/admin/users/${userId}/role`, null, {
    params: { new_role: newRole },
  });
}
