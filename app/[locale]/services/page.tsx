import React from "react";
import { getLocale, getTranslations } from "next-intl/server";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Service from "@/models/Service";
import connectToDatabase from "@/lib/mongodb";
import ContactForm from "@/app/components/home/ContactForm";
import ServicesClient from "./client";

export const dynamic = "force-dynamic";

const ServicesPage = async () => {
  const locale = await getLocale();
  const t = await getTranslations();

  await connectToDatabase();
  const services = await (Service as any).find().lean();

  // Convert MongoDB documents to plain objects
  const serviceData = JSON.parse(JSON.stringify(services));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Services Header */}
      <div className="bg-gray-50 py-12">
        <MaxWidthWrapper>
          <div className="text-center">
            <p className="text-fuchsia-600 text-sm font-medium mb-2">{locale === "ar" ? "خدماتنا" : "Our Services"}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
              {locale === "ar"
                ? "اكتشف جميع الخدمات التي نقدمها للعملاء"
                : "Discover all the services we offer to clients"}
            </h1>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Client Component with services data */}
      <ServicesClient services={serviceData} locale={locale} />

      {/* Contact Form */}
      <ContactForm locale={locale} />
    </div>
  );
};

export default ServicesPage;
