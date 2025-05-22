import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface LangSwitcherProps {
  locale: string;
}

export default function LangSwitcher({ locale }: LangSwitcherProps) {
  const pathname = usePathname();
  const isArabic = locale === "ar";

  // Remove locale prefix from pathname to get the route
  const route = pathname.replace(/^\/(ar|en)/, "") || "/";
  const targetLocale = isArabic ? "en" : "ar";

  // Ensure we don't have double slashes in the path
  const cleanRoute = route.startsWith("/") ? route : `/${route}`;
  const targetPath = `/${targetLocale}${cleanRoute}`;

  return (
    <Link
      href={targetPath}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium text-white hover:text-[#d359ff] transition-colors mx-4"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
        <span className="mr-1">{isArabic ? "English" : "العربية"}</span>
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
    </Link>
  );
}
