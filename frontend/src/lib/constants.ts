// Application constants

export const APP_NAME = "Purohitdham";
export const APP_TAGLINE = "Trusted Vedic Services at Your Doorstep";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const ITEMS_PER_PAGE = 20;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAYMENT_PENDING: "Awaiting Payment",
  PAID: "Payment Received",
  CONFIRMED: "Confirmed",
  PANDIT_ACCEPTED: "Pandit Accepted",
  PANDIT_REJECTED: "Pandit Declined",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUND_PENDING: "Refund Processing",
  REFUNDED: "Refunded",
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAYMENT_PENDING: "bg-orange-100 text-orange-800",
  PAID: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  PANDIT_ACCEPTED: "bg-emerald-100 text-emerald-800",
  PANDIT_REJECTED: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-teal-100 text-teal-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  REFUND_PENDING: "bg-amber-100 text-amber-800",
  REFUNDED: "bg-slate-100 text-slate-800",
};

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Chandigarh",
];
