import React from "react";
import Blog from "@/models/Blog";
import Blogs from "@/app/components/home/Blogs";
import { getLocale } from "next-intl/server";
import { PaginationDemo } from "@/app/components/Pagination";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import connectToDatabase from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// Renamed from 'page' to 'BlogPage' to avoid naming conflict
export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  await connectToDatabase();
  const locale = await getLocale();
  const currentPage = parseInt(searchParams.page || "1", 10); // Renamed from 'page' to 'currentPage'
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  // Fix MongoDB query with proper type casting
  const blogModel = Blog as any;

  // Get total count for pagination
  const totalCount = await blogModel.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  // Get posts for current page
  const postsData = await blogModel.find().skip(skip).limit(limit).lean();
  const posts = JSON.parse(JSON.stringify(postsData));

  return (
    <div className="bg-[#0F172A]">
      <div>
        <Blogs more={false} data={posts} locale={locale} />
        <PaginationDemo currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
