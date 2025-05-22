"use client";

import React, { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LangSwitcherProps {
  locale: string;
}

export default function LangSwitcher({ locale }: LangSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isArabic = locale === "ar";
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Combined loading state
  const isChanging = isPending || isLoading;

  // Remove locale prefix from pathname to get the route
  const route = pathname.replace(/^\/(ar|en)/, "") || "/";
  const targetLocale = isArabic ? "en" : "ar";

  // Ensure we don't have double slashes in the path
  const cleanRoute = route.startsWith("/") ? route : `/${route}`;
  const targetPath = `/${targetLocale}${cleanRoute}`;

  const handleLanguageChange = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isChanging) return;

    setIsLoading(true);

    // Use React transitions for smoother UI
    startTransition(() => {
      // Save the language choice in sessionStorage to avoid flickering on reload
      try {
        sessionStorage.setItem("preferredLocale", targetLocale);
      } catch (error) {
        console.error("Failed to save locale preference:", error);
      }

      // Navigate with a small delay to allow UI feedback
      setTimeout(() => {
        router.push(targetPath);
      }, 50);
    });
  };

  return (
    <button
      onClick={handleLanguageChange}
      disabled={isChanging}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium transition-colors mx-4 ${
        isChanging ? "opacity-70 cursor-not-allowed" : "text-white hover:text-[#d359ff]"
      }`}
      aria-label={`Switch to ${isArabic ? "English" : "Arabic"}`}
    >
      <motion.div
        whileHover={!isChanging ? { scale: 1.05 } : {}}
        whileTap={!isChanging ? { scale: 0.95 } : {}}
        className="flex items-center"
      >
        {isChanging ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin text-[#8a70d6]" />
        ) : (
          <span className="mr-1">{isArabic ? "English" : "العربية"}</span>
        )}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          className="text-[#8a70d6]"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2 12H22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </button>
  );
}
