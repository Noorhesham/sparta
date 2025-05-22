import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { productColumns } from "./columns";

export const dynamic = "force-dynamic";

const ProductsPage = async ({
  searchParams,
  params,
}: {
  searchParams: { page?: string };
  params: { locale: string };
}) => {
  await connectToDatabase();
  const locale = params.locale;
  const t = await getTranslations({
    namespace: "dashboard.products",
    locale,
  });

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  // Fetch products with populated category data
  const data = await Product.find({})
    .populate("category")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  const dataObj = JSON.parse(JSON.stringify(data));
  const totalCount = await Product.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Button>
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
