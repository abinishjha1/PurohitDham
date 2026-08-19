/**
 * Bookings API functions
 */

import apiClient from "./client";
import type {
  Booking,
  CreateBookingRequest,
  CancelBookingRequest,
} from "@/types/booking";
import type { PaginatedResponse } from "@/types/common";

export async function createBooking(
  data: CreateBookingRequest
): Promise<Booking> {
  const response = await apiClient.post<Booking>("/bookings", data);
  return response.data;
}

export async function getBookings(params?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Booking>> {
  const response = await apiClient.get<PaginatedResponse<Booking>>(
    "/bookings",
    { params }
  );
  return response.data;
}

export async function getBookingById(id: string): Promise<Booking> {
  const response = await apiClient.get<Booking>(`/bookings/${id}`);
  return response.data;
}

export async function cancelBooking(
  id: string,
  data: CancelBookingRequest
): Promise<Booking> {
  const response = await apiClient.post<Booking>(
    `/bookings/${id}/cancel`,
    data
  );
  return response.data;
}
