import React from "react";
import Homepage from "@/models/Homepage";
import Blog from "@/models/Blog";
import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Logos from "../components/home/Logos";
import Services from "../components/home/Services";
import Technologies from "../components/home/Technologies";
import Blogs from "../components/home/Blogs";
import Products from "../components/home/Products";
import MaxWidthWrapper from "../components/defaults/MaxWidthWrapper";
import Link from "next/link";
import { PhoneIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Service from "@/models/Service";
export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { locale: string } }) => {
  try {
    await connectToDatabase();
    // Cast to any to bypass TypeScript errors with Mongoose
    const homepageModel = Homepage as any;
    const homepageData = await homepageModel.findOne({}).lean();
    const services = await Service.find({}).lean();
    const servicesData = JSON.parse(JSON.stringify(services));
    // Fetch latest blog posts
    const blogModel = Blog as any;
    const blogData = await blogModel.find({ published: true }).sort({ createdAt: -1 }).limit(9).lean();
    const blogDataa = JSON.parse(JSON.stringify(blogData));
    // Fetch products
    const productModel = Product as any;
    const productData = await productModel.find({}).sort({ createdAt: -1 }).limit(4).lean();
    const productDataa = JSON.parse(JSON.stringify(productData));
    const locale = params.locale;
    const t = await getTranslations({ locale });

    return (
      <div className="">
        <Hero data={homepageData?.hero} locale={locale} />
        <About data={homepageData?.about} locale={locale} />
        <Logos data={homepageData?.logos} locale={locale} />
        <Services data={servicesData} locale={locale} />
        <Technologies data={homepageData?.technologies} locale={locale} />
        <Blogs data={blogDataa} locale={locale} />
        <Products data={productDataa} locale={locale} />

        {/* CTA Section */}
        <section className="relative  z-10 overflow-hidden  border-t border-blue-500">
          <MaxWidthWrapper className="grid z-10 relative grid-cols-1 gap-10 md:grid-cols-2 items-center">
            <div className="flex flex-col gap-6 z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{t("cta.title")}</h2>
              <p className="text-gray-300 text-lg max-w-md">{t("cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href={`/${locale}/services`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#121628] transition-colors hover:bg-white/90"
                  prefetch={false}
                >
                  {t("cta.getStarted")}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center rounded-full bg-transparent border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  prefetch={false}
                >
                  {t("cta.contactUs")}
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="/Mask Group.png" className="mx-auto z-20 relative md:-ml-16" alt="contact" />
              <div className="absolute z-[1] top-0 right-0 w-full h-full">
                <img src="/Shapes (3).svg" className="w-full h-full object-cover" alt="background shapes" />
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    const locale = params.locale;
    const t = await getTranslations({ locale });

    // Return the components with default values if there's an error
    return (
      <div className="">
        <Hero locale={locale} />
        <About locale={locale} />
        <Logos locale={locale} />
        <Services locale={locale} />
        <Technologies locale={locale} />
        <Blogs locale={locale} />
        <Products locale={locale} />

        {/* CTA Section */}
        <section className="relative py-16 overflow-hidden bg-[#121628] border-t border-blue-500">
          <MaxWidthWrapper className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col gap-6 z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{t("cta.title")}</h2>
              <p className="text-gray-300 text-lg max-w-md">{t("cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#121628] transition-colors hover:bg-white/90"
                  prefetch={false}
                >
                  {t("cta.getStarted")}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center rounded-full bg-transparent border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  prefetch={false}
                >
                  {t("cta.contactUs")}
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="/Mask Group.png" className="mx-auto z-20 relative md:-ml-16" alt="contact" />
              <div className="absolute z-0 top-0 right-0 w-full h-full">
                <img src="/Shapes (3).svg" className="w-full h-full object-cover" alt="background shapes" />
              </div>
            </div>
          </MaxWidthWrapper>
        </section>
      </div>
    );
  }
};

export default Page;
