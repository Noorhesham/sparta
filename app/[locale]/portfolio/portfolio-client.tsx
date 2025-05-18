"use client";

import React, { useState, useMemo } from "react";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PortfolioClientProps {
  initialProducts: any[];
  initialCategories: any[];
  locale: string;
  translations?: {
    title: string;
    subtitle: string;
    allCategories: string;
    noProjects: string;
    viewProject: string;
    searchPlaceholder: string;
  };
}

export default function PortfolioClient({
  initialProducts,
  initialCategories,
  locale,
  translations,
}: PortfolioClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isRTL = locale === "ar";
  const t = useTranslations("Portfolio");

  // Use provided translations or fallback to t()
  const trans = {
    title: translations?.title || t("title"),
    subtitle: translations?.subtitle || t("subtitle"),
    allCategories: translations?.allCategories || t("allCategories"),
    noProjects: translations?.noProjects || t("noProjects"),
    viewProject: translations?.viewProject || t("viewProject"),
    searchPlaceholder: translations?.searchPlaceholder || t("searchPlaceholder"),
  };

  // Filter products based on search term and selected category
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        searchTerm === "" ||
        product.title_en?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        product.project_name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        (product.title_ar && product.title_ar.includes(searchTerm)) ||
        (product.description_en && product.description_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description_ar && product.description_ar.includes(searchTerm));

      const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchTerm, selectedCategory]);

  // Get translated title
  const getTitle = (product: any) => {
    if (locale === "ar" && product.title_ar) {
      return product.title_ar;
    }
    if (product.title_en) {
      return product.title_en;
    }
    return product.project_name || "Unnamed Project";
  };

  // Get translated description
  const getDescription = (product: any) => {
    if (locale === "ar" && product.description_ar) {
      return product.description_ar;
    }
    if (product.description_en) {
      return product.description_en;
    }
    return product.description || "";
  };

  // Get translated category name
  const getCategoryName = (category: any) => {
    return locale === "ar" && category.name_ar ? category.name_ar : category.name_en;
  };

  return (
    <div className={` ${isRTL ? "rtl" : ""}`}>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{trans.title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{trans.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        {/* Categories Filter */}
        <div className={`flex flex-wrap items-center gap-2 ${isRTL ? "md:justify-end" : "md:justify-start"}`}>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              !selectedCategory ? "bg-fuchsia-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            {trans.allCategories}
          </button>
          {initialCategories.map((category) => (
            <button
              key={category._id}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category._id
                  ? "bg-fuchsia-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category._id)}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <AnimatePresence>
        {filteredProducts.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={product.cover || "/placeholder-project.jpg"}
                    alt={getTitle(product)}
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="p-4">
                  {product.category && (
                    <span className="text-xs font-medium text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded-full">
                      {getCategoryName(product.category)}
                    </span>
                  )}
                  <h3 className="font-semibold text-lg mt-2">{getTitle(product)}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">{getDescription(product)}</p>
                  <Link
                    href={`/${locale}/portfolio/${product.slug || product._id}`}
                    className="mt-3 inline-flex items-center text-sm text-fuchsia-600 hover:text-fuchsia-700"
                  >
                    {trans.viewProject}
                    <svg
                      className={`w-5 h-5 ${isRTL ? "rotate-180 mr-1" : "ml-1"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">{trans.noProjects}</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
