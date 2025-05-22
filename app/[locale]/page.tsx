import React from "react";
import Homepage from "@/models/Homepage";
import Blog from "@/models/Blog";
import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";
import { getLocale, getTranslations } from "next-intl/server";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Logos from "../components/home/Logos";
import Services from "../components/home/Services";
import Technologies from "../components/home/Technologies";
import Blogs from "../components/home/Blogs";
import Products from "../components/home/Products";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { locale: string } }) => {
  try {
    await connectToDatabase();

    // Cast to any to bypass TypeScript errors with Mongoose
    const homepageModel = Homepage as any;
    const homepageData = await homepageModel.findOne({}).lean();

    // Fetch latest blog posts
    const blogModel = Blog as any;
    const blogData = await blogModel.find({ published: true }).sort({ createdAt: -1 }).limit(9).lean();
    const blogDataa = JSON.parse(JSON.stringify(blogData));
    // Fetch products
    const productModel = Product as any;
    const productData = await productModel.find({}).sort({ createdAt: -1 }).limit(4).lean();
    const productDataa = JSON.parse(JSON.stringify(productData));
    const locale = params.locale;

    return (
      <div className="">
        <Hero data={homepageData?.hero} locale={locale} />
        <About data={homepageData?.about} locale={locale} />
        <Logos data={homepageData?.logos} locale={locale} />
        <Services data={homepageData?.services} locale={locale} />
        <Technologies data={homepageData?.technologies} locale={locale} />
        <Blogs data={blogDataa} locale={locale} />
        <Products data={productDataa} locale={locale} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    const locale = await getLocale();
    const t = await getTranslations("home");

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
      </div>
    );
  }
};

export default Page;
