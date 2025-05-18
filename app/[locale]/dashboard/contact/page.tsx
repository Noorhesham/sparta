import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import ContactUs from "@/models/ContactUs";
import connectToDatabase from "@/lib/mongodb";
import { getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { contactColumns } from "./columns";

export const dynamic = "force-dynamic";

const ContactPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  await connectToDatabase();
  const t = await getTranslations("dashboard.contact");

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await ContactUs.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .populate("service_id")
    .lean();
  console.log(data);
  // Format contact data with service information
  const formattedData = data.map((contact) => ({
    ...contact,
    serviceName: contact.service_id ? contact.service_id.title : "Unknown",
    _id: contact._id.toString(),
    service_id: contact.service_id ? contact.service_id._id?.toString() : "",
  }));

  const dataObj = JSON.parse(JSON.stringify(formattedData));
  const totalCount = await ContactUs.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);
  console.log(dataObj);
  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>
      <DataTable
        columns={contactColumns}
        data={dataObj || []}
        page={currentPage}
        totalPages={totalPages}
        entity="ContactUs"
      />
    </MaxWidthWrapper>
  );
};

export default ContactPage;
