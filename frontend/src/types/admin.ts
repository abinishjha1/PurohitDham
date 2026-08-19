// Admin Suite TypeScript Interfaces

export interface AdminStats {
  total_revenue: number;
  total_bookings: number;
  active_pujas: number;
  verified_pandits: number;
  pending_bookings: number;
  completed_bookings: number;
}

export interface AdminCreatePujaPayload {
  category_id: string;
  name: string;
  name_hi: string;
  slug: string;
  sub_title?: string;
  sub_title_hi?: string;
  description: string;
  description_hi: string;
  duration_minutes: number;
  base_dakshina: number;
  icon?: string;
  badge?: string;
  is_popular?: boolean;
  benefits?: string[];
  samagri_list?: Array<{ item: string; qty: string }>;
  vidhi_steps?: Array<{ step: number; title: string; desc: string }>;
  packages?: Array<{ name: string; price: number; desc: string }>;
}

export interface AdminUpdatePujaPayload {
  name?: string;
  name_hi?: string;
  sub_title?: string;
  sub_title_hi?: string;
  description?: string;
  description_hi?: string;
  duration_minutes?: number;
  base_dakshina?: number;
  icon?: string;
  badge?: string;
  is_popular?: boolean;
  is_active?: boolean;
  benefits?: string[];
  samagri_list?: Array<{ item: string; qty: string }>;
  vidhi_steps?: Array<{ step: number; title: string; desc: string }>;
  packages?: Array<{ name: string; price: number; desc: string }>;
}

export interface AdminBooking {
  id: string;
  booking_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  puja_id: string;
  puja_name: string;
  pandit_id?: string | null;
  pandit_name?: string | null;
  booking_date: string;
  muhurat_time?: string | null;
  venue_address: string;
  city: string;
  state: string;
  pincode: string;
  package_name: string;
  dakshina_amount: number;
  samagri_included: boolean;
  yajman_name: string;
  gotra?: string | null;
  status: "PENDING" | "PAID" | "PANDIT_ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  admin_notes?: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}
