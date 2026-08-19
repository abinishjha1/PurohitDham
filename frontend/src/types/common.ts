// Common/shared types

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  detail: string;
  error_code?: string;
  fields?: Record<string, string>;
}

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  customer_name: string;
  pandit_profile_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "BOOKING" | "PAYMENT" | "REVIEW" | "SYSTEM";
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}
