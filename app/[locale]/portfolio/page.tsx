import { getLocale, getTranslations } from "next-intl/server";
import Product from "@/models/Product";
import Category from "@/models/Category";
import PortfolioClient from "./portfolio-client";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";

export const dynamic = "force-dynamic";

export default async function PortfolioPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations("Portfolio");

  // Fetch all categories
  const categoryModel = Category as any;
  const categoriesData = await categoryModel.find({}).sort({ name_en: 1 }).lean();
  const categories = JSON.parse(JSON.stringify(categoriesData));

  // Fetch all products
  const productModel = Product as any;
  const productsData = await productModel.find({}).populate("category").sort({ createdAt: -1 }).lean();

  const products = JSON.parse(JSON.stringify(productsData));

  const translations = {
    title: locale === "ar" ? "معرض أعمالنا" : "Our Portfolio",
    subtitle: locale === "ar" ? "تصفح أحدث مشاريعنا وأعمالنا المميزة" : "Browse our latest projects and featured works",
    allCategories: locale === "ar" ? "جميع الأقسام" : "All Categories",
    noProjects: locale === "ar" ? "لا توجد مشاريع متاحة" : "No projects available",
    viewProject: locale === "ar" ? "عرض المشروع" : "View Project",
    searchPlaceholder: locale === "ar" ? "ابحث عن مشروع..." : "Search for a project...",
  };
  console.log(products);
  return (
    <div className="bg-gray-50">
      <MaxWidthWrapper>
        <PortfolioClient
          initialProducts={products}
          initialCategories={categories}
          locale={locale}
          translations={translations}
        />
      </MaxWidthWrapper>
    </div>
  );
}
//and services shwow and dashtest
