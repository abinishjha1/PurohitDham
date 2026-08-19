// Puja service types

export interface PujaCategory {
  id: string;
  name: string;
  name_hindi: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export interface PujaService {
  id: string;
  category_id: string;
  category: PujaCategory;
  name: string;
  name_hindi: string | null;
  slug: string;
  description: string | null;
  detailed_description: string | null;
  duration_minutes: number;
  base_price: number;
  image_url: string | null;
  samagri_included: boolean;
  samagri_list: string | null;
}

export interface PujaServiceListItem {
  id: string;
  name: string;
  name_hindi: string | null;
  slug: string;
  description: string | null;
  duration_minutes: number;
  base_price: number;
  image_url: string | null;
  category_name: string;
}
