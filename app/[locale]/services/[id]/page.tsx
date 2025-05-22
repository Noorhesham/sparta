import React from "react";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Service from "@/models/Service";
import { getTranslations } from "next-intl/server";
import ServiceDetailClient from "./client";

export const dynamic = "force-dynamic";

async function getServiceById(id: string) {
  try {
    await connectToDatabase();
    // Cast to any to bypass TypeScript errors with Mongoose
    const serviceModel = Service as any;
    const service = await serviceModel.findById(id).lean();

    if (!service) {
      return null;
    }

    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

export default async function ServiceDetailPage({ params }: { params: { locale: string; id: string } }) {
  const service = await getServiceById(params.id);
  const t = await getTranslations({ locale: params.locale });

  if (!service) {
    notFound();
  }

  const translations = {
    backToServices: t("Services.backToServices"),
    serviceDetails: t("Services.serviceDetails"),
    noDescriptions: t("Services.noDescriptions"),
  };

  return <ServiceDetailClient service={service} locale={params.locale} translations={translations} />;
}
