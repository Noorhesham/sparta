"use client";

import React, { useState } from "react";
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
  translations?: {
    title: string;
    subtitle: string;
    noServices: string;
  };
}

const ServicesClient = ({ services, locale, translations }: ServiceProps) => {
  // Set default service or first service as active
  const [activeServiceId, setActiveServiceId] = useState(services.length > 0 ? services[0]._id : "");

  // Get the currently active service
  const activeService = services.find((service) => service._id === activeServiceId) || services[0];
  const isRTL = locale === "ar";

  return (
    <div className="py-8">
      <MaxWidthWrapper>
        <div className={`flex flex-col md:flex-row gap-6 ${isRTL ? "rtl" : "ltr"}`}>
          {/* Tabs Navigation */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col">
                {services.length > 0 ? (
                  services.map((service) => (
                    <button
                      key={service._id}
                      onClick={() => setActiveServiceId(service._id)}
                      className={`flex items-center gap-3 p-4 text-left transition-colors duration-200
                        ${isRTL ? "text-right border-r-4 border-l-0" : "text-left border-l-4 border-r-0"} 
                        ${
                          service._id === activeServiceId
                            ? "border-fuchsia-600 bg-fuchsia-50"
                            : "border-transparent hover:bg-gray-50"
                        }`}
                      aria-current={service._id === activeServiceId ? "page" : undefined}
                    >
                      <div
                        className={`w-6 h-6 flex-shrink-0 ${
                          service._id === activeServiceId ? "text-fuchsia-600" : "text-gray-500"
                        }`}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                        </svg>
                      </div>
                      <span
                        className={`font-medium ${
                          service._id === activeServiceId ? "text-fuchsia-600" : "text-gray-700"
                        }`}
                      >
                        {locale === "ar" ? service.title_ar : service.title_en}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {translations?.noServices || "No services available"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Service Descriptions */}
              {activeService ? (
                <div className="space-y-8">
                  <h3
                    className={`flex items-center text-gray-900 gap-2 text-xl font-semibold mb-6 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-fuchsia-600 flex-shrink-0"></span>
                    {locale === "ar" ? activeService.title_ar : activeService.title_en}
                  </h3>

                  {activeService.descriptions && activeService.descriptions.length > 0 ? (
                    <div className="space-y-6">
                      {activeService.descriptions.map((desc, descIndex) => (
                        <div key={descIndex} className="border-b pb-6 last:border-0 last:pb-0">
                          <div
                            className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
                          >
                            <div className="mt-2 w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-lg text-gray-900 mb-2">
                                {locale === "ar" ? desc.title_ar : desc.title_en}
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                {locale === "ar" ? desc.description_ar : desc.description_en}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      {locale === "ar" ? "لا يوجد تفاصيل متاحة لهذه الخدمة" : "No details available for this service"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {translations?.noServices ||
                      (locale === "ar" ? "لا توجد خدمات متاحة حالياً" : "No services available at the moment")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default ServicesClient;
