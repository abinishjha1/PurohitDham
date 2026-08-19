// Authentication & User types

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PANDIT = "PANDIT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_email_verified: boolean;
  avatar_url: string | null;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole.CUSTOMER | UserRole.PANDIT;
}

export interface GoogleLoginRequest {
  id_token: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
}
