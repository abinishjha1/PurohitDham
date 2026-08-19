/**
 * Puja Catalog API functions
 */

import apiClient from "./client";
import type {
  PujaCategory,
  PujaListResponse,
  PujaServiceDetail,
} from "@/types/puja";

export async function getCategories(): Promise<PujaCategory[]> {
  const response = await apiClient.get<PujaCategory[]>("/categories");
  return response.data;
}

export async function getPujas(params?: {
  category?: string;
  search?: string;
  popular?: boolean;
  limit?: number;
  offset?: number;
}): Promise<PujaListResponse> {
  const response = await apiClient.get<PujaListResponse>("/pujas", {
    params,
  });
  return response.data;
}

export async function getPujaBySlug(slug: string): Promise<PujaServiceDetail> {
  const response = await apiClient.get<PujaServiceDetail>(`/pujas/${slug}`);
  return response.data;
}
