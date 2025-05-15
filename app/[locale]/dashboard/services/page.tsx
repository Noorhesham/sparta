import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Service from "@/models/Service";
import connectToDatabase from "@/lib/mongodb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { serviceColumns } from "./columns";

export const dynamic = "force-dynamic";

const ServicesPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  await connectToDatabase();
  const locale = await getLocale();
  const t = await getTranslations("dashboard.services");

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await Service.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  const dataObj = JSON.parse(JSON.stringify(data));
  const totalCount = await Service.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);
  console.log("totalPages", data);
  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        <Button className="self-end">
          <Link href={`/${locale}/dashboard/services/create`}>{t("addService")}</Link>
        </Button>
      </div>
      <DataTable
        columns={serviceColumns}
        data={dataObj || []}
        page={currentPage}
        totalPages={totalPages}
        entity="Service"
      />
    </MaxWidthWrapper>
  );
};

export default ServicesPage;
