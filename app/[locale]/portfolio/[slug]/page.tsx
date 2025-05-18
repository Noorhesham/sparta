import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { ArrowLeft } from "lucide-react";
import ProductGallery from "./ProductGallery";
import { getLocale } from "next-intl/server";
import Paragraph from "@/app/components/defaults/Paragraph";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  try {
    const productModel = Product as any;
    const product = await productModel.findOne({ slug }).populate("category").lean();

    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  const locale = await getLocale();
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Format category name based on locale
  const categoryName = product.category ? (locale === "ar" ? product.category.name_ar : product.category.name_en) : "";

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href={`/${locale}/portfolio`}
          className="inline-flex items-center text-gray-600 hover:text-fuchsia-600 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>{locale === "ar" ? "العودة إلى المعرض" : "Back to portfolio"}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery Section */}
          <div className="relative">
            <div className=" rounded-3xl p-6 h-full">
              <ProductGallery images={[product.cover, ...(product.project_images || [])]} name={product.project_name} />
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.project_name}</h1>

            {categoryName && (
              <div className="mb-6">
                <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {categoryName}
                </span>
              </div>
            )}

            <div className="prose max-w-none mb-8">
              <Paragraph className="!text-gray-800" content={product.description} locale={locale} />
            </div>

            {/* App Store Links */}
            <div className="flex flex-wrap gap-4 mt-4">
              {product.google_link && (
                <a
                  href={product.google_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Image src="/Google Play.svg" alt="Get it on Google Play" width={160} height={48} />
                </a>
              )}

              {product.app_store_link && (
                <a
                  href={product.app_store_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Image src="/App Store.svg" alt="Download on the App Store" width={160} height={48} />
                </a>
              )}

              {product.website_link && (
                <a
                  href={product.website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-md bg-fuchsia-600 text-white px-6 py-3 font-medium transition-colors hover:bg-fuchsia-700"
                >
                  {locale === "ar" ? "زيارة الموقع" : "Visit Website"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
