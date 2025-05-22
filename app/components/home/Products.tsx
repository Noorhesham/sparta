"use client";

import React from "react";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Flex from "@/app/components/defaults/Flex";
import ProductCard from "./ProductCard";
import MotionContainer from "../defaults/MotionContainer";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ProductType {
  _id: string;
  project_name: string;
  slug: string;
  description: string;
  cover: string;
  website_link?: string;
  google_link?: string;
  app_store_link?: string;
  project_images: string[];
  createdAt: Date;
}

interface ProductsProps {
  data?: ProductType[];
  locale?: string;
}

export default function Products({ data = [], locale = "en" }: ProductsProps) {
  // Limit to 4 products for homepage display
  const limitedProducts = data.slice(0, 4);
  const t = useTranslations("");
  const isRTL = locale === "ar";

  return (
    <section className="bg-[#111827]  relative overflow-hidden">
      {/* Colorful vertical bars */}
      {/* <div className="absolute left-[10%] z[-1] top-0 h-full w-4 md:w-6 bg-purple-600 opacity-90"></div>
      <div className="absolute left-[calc(10%+60px)] z[-1] top-0 h-full w-4 md:w-6 bg-cyan-400 opacity-80"></div>
      <div className="absolute left-[calc(10%+120px)] z[-1] top-0 h-full w-4 md:w-6 bg-fuchsia-500 opacity-90"></div> */}

      <MaxWidthWrapper className={`relative z-20 ${isRTL ? "rtl" : ""}`}>
        <Flex direction="col" gap="xl">
          <div className="flex uppercase mx-auto flex-col items-center text-center mb-8">
            <span className="text-fuchsia-500 text-sm font-medium">{t("portfolio")}</span>
            <h2 className="text-3xl font-bold text-white mt-2">{t("recentProducts")}</h2>
          </div>

          <MotionContainer className="flex w-full flex-col gap-6">
            {limitedProducts.map((product, index) => (
              <ProductCard
                key={product._id}
                name={product.project_name}
                slug={product.slug}
                description={product.description}
                cover={product.cover}
                website_link={product.website_link}
                locale={locale}
              />
            ))}
          </MotionContainer>
        </Flex>
      </MaxWidthWrapper>
    </section>
  );
}
