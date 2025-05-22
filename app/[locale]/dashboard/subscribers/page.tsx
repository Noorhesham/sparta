import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Subscriber from "@/models/Subscriber";
import connectToDatabase from "@/lib/mongodb";
import { getLocale, getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { subscriberColumns } from "./columns";

export const dynamic = "force-dynamic";

const SubscribersPage = async ({
  searchParams,
  params,
}: {
  searchParams: { page?: string };
  params: { locale: string };
}) => {
  await connectToDatabase();
  const locale = params.locale;

  const t = await getTranslations({
    namespace: "dashboard.subscribers",
    locale,
  });

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await Subscriber.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  const dataObj = JSON.parse(JSON.stringify(data));
  const totalCount = await Subscriber.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>
      <DataTable
        columns={subscriberColumns}
        data={dataObj || []}
        page={currentPage}
        totalPages={totalPages}
        entity="Subscriber"
      />
    </MaxWidthWrapper>
  );
};

export default SubscribersPage;
