"use client";

import React, { useState } from "react";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ServiceDetailProps {
  service: {
    _id: string;
    icon: string;
    title_en: string;
    title_ar: string;
    slug: string;
    descriptions: Array<{
      _id: string;
      title_en: string;
      title_ar: string;
      description_en: string;
      description_ar: string;
    }>;
  };
  locale: string;
  translations: {
    backToServices: string;
    serviceDetails: string;
    noDescriptions: string;
  };
}

export default function ServiceDetailClient({ service, locale, translations }: ServiceDetailProps) {
  const isRTL = locale === "ar";
  const serviceTitle = locale === "ar" ? service.title_ar : service.title_en;
  console.log(service);

  // Set the first description as active by default
  const [activeDescriptionId, setActiveDescriptionId] = useState(
    service.descriptions && service.descriptions.length > 0 ? service.descriptions[0]._id : ""
  );

  // Find the active description
  const activeDescription =
    service.descriptions?.find((desc) => desc._id === activeDescriptionId) || service.descriptions?.[0];

  return (
    <div className="py-8">
      <MaxWidthWrapper>
        {/* Back to services link */}
        <Link
          href={`/${locale}/services`}
          className={`flex items-center gap-2 text-gray-600 hover:text-fuchsia-600 mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
          <span>{translations.backToServices}</span>
        </Link>

        {/* Service title */}
        <h1 className={`text-3xl font-bold text-gray-900 mb-8 ${isRTL ? "text-right" : "text-left"}`}>
          {serviceTitle}
        </h1>

        <div className={`flex flex-col md:flex-row gap-6 ${isRTL ? "rtl" : "ltr"}`}>
          {/* Left sidebar with description titles */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col">
                {service.descriptions && service.descriptions.length > 0 ? (
                  service.descriptions.map((desc) => (
                    <button
                      key={desc._id}
                      onClick={() => setActiveDescriptionId(desc._id)}
                      className={`flex items-center gap-3 p-4 text-left transition-colors duration-200
                        ${isRTL ? "text-right border-r-4 border-l-0" : "text-left border-l-4 border-r-0"} 
                        ${
                          desc._id === activeDescriptionId
                            ? "border-fuchsia-600 bg-fuchsia-50"
                            : "border-transparent hover:bg-gray-50"
                        }`}
                      aria-current={desc._id === activeDescriptionId ? "page" : undefined}
                    >
                      <span
                        className={`font-medium ${
                          desc._id === activeDescriptionId ? "text-fuchsia-600" : "text-gray-700"
                        }`}
                      >
                        {locale === "ar" ? desc.title_ar : desc.title_en}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">{translations.noDescriptions}</div>
                )}
              </div>
            </div>
          </div>

          {/* Right content area */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {activeDescription ? (
                <div className={`${isRTL ? "text-right" : "text-left"}`}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b">
                    {locale === "ar" ? activeDescription.title_ar : activeDescription.title_en}
                  </h2>
                  <div className="prose max-w-none text-gray-600">
                    <p className="leading-relaxed">
                      {locale === "ar" ? activeDescription.description_ar : activeDescription.description_en}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{translations.noDescriptions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
