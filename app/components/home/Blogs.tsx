"use client";

import React from "react";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Flex from "@/app/components/defaults/Flex";
import BlogCard from "./BlogCard";
import Link from "next/link";
import MotionContainer from "../defaults/MotionContainer";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface BlogType {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  slug: string;
  description: {
    en: string;
    ar: string;
  };
  mainImage: string;
  thumbnailImage: string;
  createdAt: Date;
}

interface BlogsProps {
  data?: BlogType[];
  locale?: string;
  more?: boolean;
}

export default function Blogs({ data = [], locale = "en", more = true }: BlogsProps) {
  const t = useTranslations("Blog");
  const isRTL = locale === "ar";

  return (
    <section className="bg-[#0F172A]">
      <MaxWidthWrapper>
        <Flex direction="col" gap="xl">
          <div className="flex text-center mx-auto flex-col items-center text-center mb-8">
            <span className="text-[#8B5CF6] text-sm font-medium">{t("blogSection")}</span>
            <h2 className="text-3xl font-bold text-white mt-2">{t("allPosts")}</h2>
          </div>

          <MotionContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((blog) => (
              <motion.div key={blog._id} className="h-full">
                <BlogCard
                  title={blog.title[locale as keyof typeof blog.title]}
                  description={blog.description[locale as keyof typeof blog.description]}
                  slug={blog.slug}
                  date={new Date(blog.createdAt)}
                  image={blog.thumbnailImage || blog.mainImage}
                  locale={locale}
                />
              </motion.div>
            ))}
          </MotionContainer>

          {more && (
            <div className={`flex ${isRTL ? "mr-auto justify-start" : "ml-auto justify-end"} mt-8`}>
              <Link
                href={`/${locale}/blog`}
                className="flex items-center text-white hover:text-[#8B5CF6] transition-colors"
              >
                <span className={`${isRTL ? "ml-2" : "mr-2"}`}>{t("moreArticles")}</span>
                <svg
                  className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </Flex>
      </MaxWidthWrapper>
    </section>
  );
}
