"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check localStorage directly for immediate check
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!storedToken || !storedUser) {
      router.push("/login");
      return;
    }

    // If store hasn't hydrated yet, set it from localStorage
    if (!token || !user) {
      try {
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        if (parsedUser && storedToken) {
          useAuthStore.getState().setAuth(parsedUser, storedToken);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        router.push("/login");
        return;
      }
    }

    setIsChecking(false);
  }, [user, token, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !token) {
    return null;
  }

  return <>{children}</>;
}
