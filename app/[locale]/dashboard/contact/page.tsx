import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import ContactUs from "@/models/ContactUs";
import Service from "@/models/Service";
import connectToDatabase from "@/lib/mongodb";
import { getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { contactColumns } from "./columns";

export const dynamic = "force-dynamic";

const ContactPage = async ({
  searchParams,
  params,
}: {
  searchParams: { page?: string };
  params: { locale: string };
}) => {
  await connectToDatabase();
  const locale = params.locale;
  const t = await getTranslations({
    namespace: "dashboard.contact",
    locale,
  });

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  // First get all contacts
  const contacts = await ContactUs.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  // Get all service IDs from contacts
  const serviceIds = contacts.reduce((acc: string[], contact: any) => {
    if (contact.service_ids && Array.isArray(contact.service_ids)) {
      return [...acc, ...contact.service_ids];
    }
    return acc;
  }, []);

  // Fetch all services in one query
  const services = await Service.find({ _id: { $in: serviceIds } })
    .select("_id title_en title_ar")
    .lean();

  // Create a map of services for quick lookup
  const servicesMap = services.reduce((acc: any, service: any) => {
    acc[service._id.toString()] = service;
    return acc;
  }, {});

  // Format contact data with populated services
  const formattedData = contacts.map((contact: any) => {
    const populatedServices = (contact.service_ids || [])
      .map((serviceId: any) => {
        const serviceIdStr = typeof serviceId === "string" ? serviceId : serviceId.toString();
        return servicesMap[serviceIdStr] || null;
      })
      .filter(Boolean);

    return {
      ...contact,
      _id: contact._id.toString(),
      service_ids: populatedServices.map((service: any) => ({
        _id: service._id.toString(),
        title_en: service.title_en,
        title_ar: service.title_ar,
      })),
    };
  });

  const dataObj = JSON.parse(JSON.stringify(formattedData));
  const totalCount = await ContactUs.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

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
