import React from "react";
import { getLocale, getTranslations } from "next-intl/server";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Service from "@/models/Service";
import connectToDatabase from "@/lib/mongodb";
import ContactForm from "@/app/components/home/ContactForm";
import Services from "@/app/components/home/Services";

const ServicesPage = async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({
    namespace: "Services",
    locale,
  });

  await connectToDatabase();
  const services = await Service.find({}).lean();

  // Convert MongoDB documents to plain objects
  const serviceData = JSON.parse(JSON.stringify(services));

  const isRTL = locale === "ar";

  return (
    <div className={`bg-gray-50 min-h-screen ${isRTL ? "rtl" : "ltr"}`}>
      {/* Client Component with services data and translations */}
      <Services data={serviceData} locale={locale} />
      {/* Contact Form */}
      <ContactForm locale={locale} />
    </div>
  );
};

export default ServicesPage;
