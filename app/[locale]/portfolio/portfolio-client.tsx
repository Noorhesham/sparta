"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginationDemo } from "@/app/components/Pagination";
import { Loader2 } from "lucide-react";

// Number of products per page
const ITEMS_PER_PAGE = 8;

interface CategoryType {
  _id: string;
  name_en: string;
  name_ar: string;
}

interface ProductType {
  _id: string;
  project_name: string;
  slug: string;
  cover: string;
  category: CategoryType;
}

interface PortfolioClientProps {
  initialProducts: ProductType[];
  initialCategories: CategoryType[];
  locale: string;
}

export default function PortfolioClient({ initialProducts, initialCategories, locale }: PortfolioClientProps) {
  // State for client-side filtering
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Filter products based on selected category
  const filteredProducts =
    activeCategory === "all"
      ? initialProducts
      : initialProducts.filter((product) => product.category?._id === activeCategory);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setActiveCategory(category);
    setCurrentPage(1);

    // Add fake loading delay for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);

    // Add fake loading delay for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="container mx-auto">
      {/* Portfolio Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {locale === "ar" ? "معرض الأعمال" : "Our Portfolio"}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {locale === "ar"
            ? "اكتشف مجموعة متنوعة من مشاريعنا التي تظهر خبرتنا في مختلف التخصصات"
            : "Discover our diverse collection of projects showcasing our expertise across various disciplines"}
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="h-auto p-1 bg-gray-100">
            <TabsTrigger
              value="all"
              className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-black font-medium"
            >
              {locale === "ar" ? "الكل" : "All"}
            </TabsTrigger>

            {initialCategories.map((category) => (
              <TabsTrigger
                key={category._id}
                value={category._id}
                className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-black font-medium"
              >
                {locale === "ar" ? category.name_ar : category.name_en}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-12 w-12 text-fuchsia-600 animate-spin mb-4" />
            <p className="text-gray-600">{locale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <TabsContent value={activeCategory} className="mt-0">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">
                  {locale === "ar" ? "لا توجد منتجات في هذه الفئة" : "No products found in this category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <Link href={`/${locale}/portfolio/${product.slug}`} key={product._id} className="group">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <div className="relative w-full h-48">
                        <Image src={product.cover} alt={product.project_name} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-fuchsia-600">
                          {product.project_name}
                        </h3>
                        {product.category && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {locale === "ar" ? product.category.name_ar : product.category.name_en}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Pagination */}
      {filteredProducts.length > ITEMS_PER_PAGE && !isLoading && (
        <div className="mt-10">
          <PaginationDemo totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
