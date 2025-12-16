"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Plus, LogOut, PlusCircle } from "lucide-react";

interface HeaderProps {
  breadcrumb?: string;
  title: string;
  showPlusIcon?: boolean;
  onPlusClick?: () => void;
  rightAction?: ReactNode;
  showLogout?: boolean;
}

export default function Header({
  breadcrumb,
  title,
  showPlusIcon = false,
  onPlusClick,
  rightAction,
  showLogout = false,
}: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="w-full mt-16">
      {/* Breadcrumb section */}
      {breadcrumb && (
        <div className="mb-2">
          <p className="text-[#C4C4C4] body-md">{breadcrumb}</p>
        </div>
      )}

      {/* Main header section with dark teal background */}
      <div className="bg-background rounded-lg px-4 md:px-6 py-4 md:py-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Left side - Title with optional plus icon */}
          <div className="flex items-center gap-3">
            <h1 className="heading-2 text-white">{title}</h1>
            {showPlusIcon && (
              <button
                onClick={onPlusClick}
                className="text-white hover:text-primary transition-colors p-1 relative top-1"
                aria-label="Add movie"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-4">
            {rightAction}
            {showLogout && (
              <button
                onClick={handleLogout}
                className="text-white hover:text-primary transition-colors body-md flex items-center gap-2"
              >
                <span>Logout</span>
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
