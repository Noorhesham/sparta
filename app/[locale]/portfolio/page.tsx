import { getLocale } from "next-intl/server";
import Product from "@/models/Product";
import Category from "@/models/Category";
import PortfolioClient from "./portfolio-client";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const locale = await getLocale();

  // Fetch all categories
  const categoryModel = Category as any;
  const categoriesData = await categoryModel.find({}).sort({ name_en: 1 }).lean();
  const categories = JSON.parse(JSON.stringify(categoriesData));

  // Fetch all products
  const productModel = Product as any;
  const productsData = await productModel.find({}).populate("category").sort({ createdAt: -1 }).lean();

  const products = JSON.parse(JSON.stringify(productsData));

  return (
    <div className="bg-gray-50">
      <MaxWidthWrapper>
        <PortfolioClient initialProducts={products} initialCategories={categories} locale={locale} />
      </MaxWidthWrapper>
    </div>
  );
}
//and services shwow and dashtest 