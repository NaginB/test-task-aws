"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
        set({ user, token });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      // Ensure we read from localStorage immediately
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          localStorage.removeItem(name);
        },
      },
    }
  )
);
