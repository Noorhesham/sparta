"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";

interface ServiceProps {
  services: Array<{
    _id: string;
    icon: string;
    title_en: string;
    title_ar: string;
    slug: string;
    descriptions: Array<{
      title_en: string;
      title_ar: string;
      description_en: string;
      description_ar: string;
    }>;
  }>;
  locale: string;
}

const ServicesClient = ({ services, locale }: ServiceProps) => {
  const [activeServiceId, setActiveServiceId] = useState(services.length > 0 ? services[0]._id : "");

  // Get the currently active service
  const activeService = services.find((service) => service._id === activeServiceId) || services[0];

  return (
    <MaxWidthWrapper className="">
      <div className="flex flex-col md:flex-row">
        {/* Tabs Navigation */}
        <div className="w-full md:w-1/3 lg:w-1/4 md:pr-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-col">
              {services.map((service) => (
                <button
                  key={service._id}
                  onClick={() => setActiveServiceId(service._id)}
                  className={`flex items-center gap-3 p-4 text-left border-l-4 ${
                    service._id === activeServiceId
                      ? "border-fuchsia-600 bg-fuchsia-50"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-6 h-6 ${service._id === activeServiceId ? "text-fuchsia-600" : "text-gray-500"}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                    </svg>
                  </div>
                  <span
                    className={`font-medium ${service._id === activeServiceId ? "text-fuchsia-600" : "text-gray-700"}`}
                  >
                    {locale === "ar" ? service.title_ar : service.title_en}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full md:w-2/3 lg:w-3/4 mt-6 md:mt-0">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            {/* Service Descriptions */}
            {activeService ? (
              <div className="space-y-8">
                <h3 className="flex items-center text-gray-900 gap-2 text-lg font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full text-gray-900 bg-fuchsia-600"></span>
                  {locale === "ar" ? activeService.title_ar : activeService.title_en}
                </h3>

                {activeService.descriptions && activeService.descriptions.length > 0 && (
                  <div className="space-y-6">
                    {activeService.descriptions.map((desc, descIndex) => (
                      <div key={descIndex} className="border-b pb-4 last:border-0">
                        <div className="flex items-start">
                          <div className="mt-2 mr-3 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              {locale === "ar" ? desc.title_ar : desc.title_en}
                            </h4>
                            <p className="mt-2 text-gray-600">
                              {locale === "ar" ? desc.description_ar : desc.description_en}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {locale === "ar" ? "لا توجد خدمات متاحة حالياً" : "No services available at the moment"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ServicesClient;
