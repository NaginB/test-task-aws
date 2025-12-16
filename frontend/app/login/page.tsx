"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import FormInput from "@/forms/FormInput";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "user@example.com",
      password: "password123",
    },
  });

  useEffect(() => {
    // Check if user is already logged in
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (storedToken && storedUser) {
      // User is already logged in, redirect to home
      router.push("/");
      return;
    }

    setIsChecking(false);
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");
      const response = await api.post("/auth/login", data);
      // Store in localStorage and Zustand store
      setAuth(response.data.user, response.data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="heading-1 text-center">Sign in</h1>
        <div className="rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <FormInput
              name="email"
              placeholder="Enter email"
              register={register}
              rules={{ required: "Email is required" }}
              error={errors.email}
            />
            <FormInput
              name="password"
              type="password"
              placeholder="Enter password"
              register={register}
              rules={{ required: "Password is required" }}
              error={errors.password}
            />
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <div className="flex justify-center items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="w-4 h-4 bg-input"
              />
              <label htmlFor="remember" className="font-thin">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
