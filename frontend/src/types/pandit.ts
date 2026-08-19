// Pandit profile & onboarding types

export interface PanditOnboardRequest {
  title: string;
  gurukul_name: string;
  education_degree: string;
  experience_years: number;
  vedic_lineage?: string;
  bio?: string;
  specializations: string[];
  languages: string[];
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  service_radius_km: number;
}

export interface PanditProfile {
  id: string;
  user_id: string;
  full_name: string;
  title: string;
  gurukul_name: string;
  education_degree: string;
  experience_years: number;
  vedic_lineage?: string;
  bio?: string;
  specializations: string[];
  languages: string[];
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  service_radius_km: number;
  is_verified: boolean;
  is_available: boolean;
  rating: number;
  review_count: number;
  total_pujas_completed: number;
  avatar_url?: string;
}

export interface PanditListResponse {
  items: PanditProfile[];
  total: number;
}
