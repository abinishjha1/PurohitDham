"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, GoogleLoginRequest, AuthResponse } from "@/types/auth";
import { UserRole } from "@/types/auth";
import {
  getMe,
  login as apiLogin,
  register as apiRegister,
  googleLogin as apiGoogleLogin,
  logout as apiLogout,
} from "@/lib/api/auth";
import { setAccessToken } from "@/lib/api/client";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  googleLogin: (data: GoogleLoginRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  // Try to restore session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, [refreshUser]);

  // Listen for forced logout events (from API client on refresh failure)
  useEffect(() => {
    function handleLogout() {
      setUser(null);
      setAccessToken(null);
    }
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await apiLogin(data);
    setUser(response.user);
    return response;
  };

  const register = async (data: RegisterRequest) => {
    const response = await apiRegister(data);
    setUser(response.user);
    return response;
  };

  const googleLogin = async (data: GoogleLoginRequest) => {
    const response = await apiGoogleLogin(data);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const hasRole = (...roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
