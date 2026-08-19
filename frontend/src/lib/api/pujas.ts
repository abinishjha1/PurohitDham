/**
 * Puja services API functions
 */

import apiClient from "./client";
import type { PujaCategory, PujaService, PujaServiceListItem } from "@/types/puja";
import type { PaginatedResponse } from "@/types/common";

export async function getCategories(): Promise<PujaCategory[]> {
  const response = await apiClient.get<PujaCategory[]>("/pujas/categories");
  return response.data;
}

export async function getPujaServices(params?: {
  category_id?: string;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<PujaServiceListItem>> {
  const response = await apiClient.get<PaginatedResponse<PujaServiceListItem>>(
    "/pujas",
    { params }
  );
  return response.data;
}

export async function getPujaBySlug(slug: string): Promise<PujaService> {
  const response = await apiClient.get<PujaService>(`/pujas/${slug}`);
  return response.data;
}
