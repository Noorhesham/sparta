import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Blog from "@/models/Blog";
import connectToDatabase from "@/lib/mongodb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { blogColumns } from "./columns";

export const dynamic = "force-dynamic";

const BlogsPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  await connectToDatabase();
  const locale = await getLocale();
  const t = await getTranslations("dashboard.blogs");

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await Blog.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  const dataObj = JSON.parse(JSON.stringify(data));
  const totalCount = await Blog.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        <Button className="self-end">
          <Link href={`/${locale}/dashboard/blogs/create`}>{t("addBlog")}</Link>
        </Button>
      </div>
      <DataTable columns={blogColumns} data={dataObj} page={currentPage} totalPages={totalPages} entity="Blog" />
    </MaxWidthWrapper>
  );
};

export default BlogsPage;
