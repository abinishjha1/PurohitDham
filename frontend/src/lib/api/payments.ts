/**
 * Payments API functions
 */

import apiClient from "./client";

export interface PaymentOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface PaymentVerifyRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export async function initiatePayment(
  bookingId: string
): Promise<PaymentOrder> {
  const response = await apiClient.post<PaymentOrder>("/payments/initiate", {
    booking_id: bookingId,
  });
  return response.data;
}

export async function verifyPayment(
  data: PaymentVerifyRequest
): Promise<{ status: string; booking_id: string }> {
  const response = await apiClient.post("/payments/verify", data);
  return response.data;
}
