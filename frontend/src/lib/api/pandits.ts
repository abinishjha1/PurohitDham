/**
 * Pandit Directory & Onboarding API functions
 */

import apiClient from "./client";
import type {
  PanditListResponse,
  PanditOnboardRequest,
  PanditProfile,
} from "@/types/pandit";

export async function onboardPandit(
  data: PanditOnboardRequest
): Promise<PanditProfile> {
  const response = await apiClient.post<PanditProfile>(
    "/pandits/onboard",
    data
  );
  return response.data;
}

export async function getPandits(params?: {
  city?: string;
  specialization?: string;
  language?: string;
  limit?: number;
  offset?: number;
}): Promise<PanditListResponse> {
  const response = await apiClient.get<PanditListResponse>("/pandits", {
    params,
  });
  return response.data;
}

export async function getPanditById(id: string): Promise<PanditProfile> {
  const response = await apiClient.get<PanditProfile>(`/pandits/${id}`);
  return response.data;
}
