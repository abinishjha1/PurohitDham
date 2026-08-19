// Booking types

export enum BookingStatus {
  PENDING = "PENDING",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  PANDIT_ACCEPTED = "PANDIT_ACCEPTED",
  PANDIT_REJECTED = "PANDIT_REJECTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUND_PENDING = "REFUND_PENDING",
  REFUNDED = "REFUNDED",
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  pandit_profile_id: string;
  puja_service_id: string;
  address_id: string;
  booking_date: string;
  start_time: string;
  end_time: string | null;
  status: BookingStatus;
  total_amount: number;
  platform_fee: number;
  pandit_amount: number;
  special_instructions: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  created_at: string;
  // Expanded relations (when included)
  puja_service_name?: string;
  pandit_name?: string;
  customer_name?: string;
}

export interface CreateBookingRequest {
  puja_service_id: string;
  pandit_profile_id: string;
  address_id: string;
  booking_date: string;
  start_time: string;
  special_instructions?: string;
}

export interface CancelBookingRequest {
  reason: string;
}
