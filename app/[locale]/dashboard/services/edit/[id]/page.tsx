import { ServiceForm } from "../../components/ServiceForm";
import Service from "@/models/Service";
import connectToDatabase from "@/lib/mongodb";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function EditServicePage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const t = await getTranslations("dashboard.services");

  try {
    const service = await Service.findById(params.id).lean();

    if (!service) {
      return notFound();
    }

    // Convert MongoDB document to plain object
    const serviceData = JSON.parse(JSON.stringify(service));

    return <ServiceForm initialData={serviceData} />;
  } catch (error) {
    console.error("Error fetching service:", error);
    return notFound();
  }
}
