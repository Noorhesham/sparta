import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { productColumns } from "./columns";

export const dynamic = "force-dynamic";

const ProductsPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  await connectToDatabase();
  const locale = await getLocale();
  const t = await getTranslations("dashboard.products");

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  const dataObj = JSON.parse(JSON.stringify(data));
  const totalCount = await Product.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);
  console.log(dataObj);
  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        <Button className="self-end">
          <Link href={`/${locale}/dashboard/products/create`}>{t("addProduct")}</Link>
        </Button>
      </div>
      <DataTable
        columns={productColumns}
        data={dataObj || []}
        page={currentPage}
        totalPages={totalPages}
        entity="Product"
      />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
