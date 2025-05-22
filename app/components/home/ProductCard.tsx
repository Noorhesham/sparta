"use client";

import React from "react";
import Link from "next/link";
import Paragraph from "../defaults/Paragraph";
import MotionItem from "../defaults/MotionItem";
import { useTranslations } from "next-intl";
interface ProductCardProps {
  name: string;
  slug: string;
  description: string;
  cover: string;
  website_link?: string;
  locale?: string;
}

const ProductCard = ({ name, slug, description, cover, website_link, locale = "en" }: ProductCardProps) => {
  const t = useTranslations("");
  return (
    <MotionItem className="rounded-xl w-full overflow-hidden">
      <div className="flex flex-col md:flex-row bg-[#F0F4FF]">
        {/* Left side - Image container */}
        <div className="w-full md:w-[40%] bg-gradient-to-br from-blue-600/30 to-indigo-500/20 p-8 flex items-center justify-center min-h-[280px]">
          <img src={cover} alt={name} className="object-contain h-full max-h-[260px] max-w-full drop-shadow-lg" />
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-8 flex flex-col justify-between bg-[#F8F9FA]/5">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-black mb-4">{name}</h3>
            <Paragraph
              className="!text-[#4A5568] !text-sm !line-clamp-4"
              isHtml={true}
              content={description}
              locale={locale}
            />
          </div>

          <Link
            href={ `/portfolio/${slug}`}
            className="flex ml-auto items-center text-[#8B5CF6] transition-all w-fit group"
          >
            <span className="mr-2 text-sm">{t("readMore")}</span>
            <svg
              className="w-4 h-4  rtl:rotate-180 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </MotionItem>
  );
};

export default ProductCard;
