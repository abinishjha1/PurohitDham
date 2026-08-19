// Puja service types

export interface PujaCategory {
  id: string;
  name: string;
  name_hi: string;
  slug: string;
  icon: string;
  description?: string;
  display_order: number;
  puja_count: number;
}

export interface PujaServiceSummary {
  id: string;
  category_id: string;
  name: string;
  name_hi: string;
  slug: string;
  sub_title?: string;
  sub_title_hi?: string;
  duration_minutes: number;
  base_dakshina: number;
  icon: string;
  badge?: string;
  is_popular: boolean;
  category_name?: string;
  benefits: string[];
}

export interface PujaServiceDetail extends PujaServiceSummary {
  description: string;
  description_hi: string;
  has_samagri_included: boolean;
  samagri_list: Array<{ item: string; qty: string }>;
  vidhi_steps: Array<{ step: number; title: string; desc: string }>;
  packages: Array<{ name: string; price: number; desc: string }>;
}

export interface PujaListResponse {
  items: PujaServiceSummary[];
  total: number;
}
