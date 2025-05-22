"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  description: string;
  slug: string;
  date: Date;
  image: string;
  locale?: string;
}

const BlogCard = ({ title, description, slug, date, image, locale = "en" }: BlogCardProps) => {
  const [truncatedDescription, setTruncatedDescription] = useState("");
  const t = useTranslations("Blog");
  const isRTL = locale === "ar";

  // Format the date based on locale
  const formattedDate = format(new Date(date), "EEEE, d MMM yyyy", { locale: isRTL ? ar : undefined });

  useEffect(() => {
    // Remove HTML tags from description and limit to 100 characters
    const stripHtml = (html: string) => {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      return temp.textContent || temp.innerText || "";
    };

    const cleanDescription = stripHtml(description);
    const truncated = cleanDescription.length > 100 ? cleanDescription.substring(0, 100) + "..." : cleanDescription;

    setTruncatedDescription(truncated);
  }, [description]);

  return (
    <motion.div className="group h-full" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Link href={`/${locale}/blog/${slug}`} className="block h-full">
        <div
          className={`flex flex-col h-full bg-gray-900 text-white rounded-lg overflow-hidden shadow-lg ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <div className="relative w-full h-48 md:h-64 lg:h-48 xl:h-56">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <span className="text-xs text-gray-400 mb-2">{formattedDate}</span>
            <h3 className="text-lg font-bold mb-2 group-hover:text-[#8B5CF6] transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-gray-400 text-xs mb-4 flex-grow line-clamp-2">{truncatedDescription}</p>

            <div
              className={`flex items-center mt-auto ${isRTL ? "justify-start flex-row-reverse" : "justify-between"}`}
            >
              <span className="text-sm font-medium group-hover:text-[#8B5CF6] transition-colors">{t("readMore")}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isRTL ? " mr-auto group-hover:-translate-x-1" : "ml-auto group-hover:translate-x-1"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
