// Pandit types

export interface PanditProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  experience_years: number | null;
  languages: string[];
  specializations: string | null;
  base_price: number | null;
  rating_avg: number;
  rating_count: number;
  is_available: boolean;
  service_radius_km: number | null;
  is_verified: boolean;
}

export interface PanditListItem {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  experience_years: number | null;
  languages: string[];
  rating_avg: number;
  rating_count: number;
  base_price: number | null;
  is_verified: boolean;
}

export interface PanditAvailabilitySlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface PanditServiceLink {
  id: string;
  puja_service_id: string;
  puja_service_name: string;
  custom_price: number | null;
  is_active: boolean;
}

export enum VerificationStatus {
  REGISTERED = "REGISTERED",
  DOCUMENTS_SUBMITTED = "DOCUMENTS_SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}
