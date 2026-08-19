/**
 * Pandits API functions
 */

import apiClient from "./client";
import type { PanditProfile, PanditListItem, PanditAvailabilitySlot } from "@/types/pandit";
import type { PaginatedResponse, Review } from "@/types/common";

export async function getPandits(params?: {
  city?: string;
  puja_service_id?: string;
  language?: string;
  min_rating?: number;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<PanditListItem>> {
  const response = await apiClient.get<PaginatedResponse<PanditListItem>>(
    "/pandits",
    { params }
  );
  return response.data;
}

export async function getPanditById(id: string): Promise<PanditProfile> {
  const response = await apiClient.get<PanditProfile>(`/pandits/${id}`);
  return response.data;
}

export async function getPanditReviews(
  id: string,
  params?: { page?: number; page_size?: number }
): Promise<PaginatedResponse<Review>> {
  const response = await apiClient.get<PaginatedResponse<Review>>(
    `/pandits/${id}/reviews`,
    { params }
  );
  return response.data;
}

export async function getPanditAvailability(
  id: string,
  params: { date: string; puja_service_id: string }
): Promise<PanditAvailabilitySlot[]> {
  const response = await apiClient.get<PanditAvailabilitySlot[]>(
    `/pandits/${id}/availability`,
    { params }
  );
  return response.data;
}
