/**
 * Auth API functions
 */

import apiClient, { setAccessToken } from "./client";
import type {
  LoginRequest,
  RegisterRequest,
  GoogleLoginRequest,
  AuthResponse,
  User,
} from "@/types/auth";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  setAccessToken(response.data.access_token);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  setAccessToken(response.data.access_token);
  return response.data;
}

export async function googleLogin(data: GoogleLoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/google", data);
  setAccessToken(response.data.access_token);
  return response.data;
}

export async function refreshToken(): Promise<string> {
  const response = await apiClient.post("/auth/refresh");
  const token = response.data.access_token;
  setAccessToken(token);
  return token;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
  setAccessToken(null);
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
}
