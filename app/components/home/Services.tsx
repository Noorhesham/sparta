"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Flex from "@/app/components/defaults/Flex";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Paragraph from "../defaults/Paragraph";

// Updated interface to match Service model structure
interface ServiceModelType {
  _id: string;
  icon: string;
  title_en: string;
  title_ar: string;
  slug: string;
  descriptions: {
    _id: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

interface ServicesProps {
  data?: ServiceModelType[] | any[];
  locale?: string;
}

export default function Services({ data = [], locale = "en" }: ServicesProps) {
  const t = useTranslations("Services");
  const isRTL = locale === "ar";
  console.log(data);
  // Custom pagination rendering
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className} ${
        index === 0 ? "!w-8 !bg-[#C026D3]" : "!w-2"
      } !h-2 !rounded-full !mx-1 !transition-all !duration-300"></span>`;
    },
  };

  // Helper function to get color based on service title
  const getBgColor = (title: string) => {
    if (!title) return "#F3F4F650";
    if (title.includes("Interaction") || title.includes("تفاعل")) return "#A5F3FC50";
    if (title.includes("UX") || title.includes("تجربة")) return "#E0E7FF50";
    if (title.includes("Interface") || title.includes("واجهة")) return "#FCE7F350";
    return "#F3F4F650";
  };
  return (
    <section className={`bg-slate-50 ${isRTL ? "rtl" : "ltr"}`}>
      <MaxWidthWrapper>
        <Flex direction="col" align="center" gap="2xl">
          <div className="w-full text-center mb-2">
            <span className="text-[#C026D3] text-sm font-medium">{t("sectionTitle")}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{t("sectionSubtitle")}</h2>
          </div>

          <div className="w-full">
            {data.length > 0 ? (
              <Swiper
                slidesPerView={1}
                spaceBetween={16}
                pagination={pagination}
                navigation={false}
                modules={[Pagination, Navigation]}
                className="services-swiper"
                dir={isRTL ? "rtl" : "ltr"}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 48,
                  },
                }}
              >
                {data.map((service, index) => {
                  // Get title and description based on locale
                  const title = locale === "ar" ? service?.title_ar : service?.title_en;
                  const description =
                    service?.descriptions && service?.descriptions?.length > 0
                      ? locale === "ar"
                        ? service?.descriptions?.[0]?.description_ar
                        : service?.descriptions?.[0]?.description_en
                      : "";

                  const bgColor = getBgColor(title);

                  return (
                    <SwiperSlide className="h-full" key={service._id || index}>
                      <div
                        className="bg-white min-h-52 rounded-lg p-6 !h-full flex flex-col shadow-sm"
                        style={{ backgroundColor: bgColor }}
                      >
                        <div className="flex h-full items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                            style={{ backgroundColor: bgColor }}
                          >
                            <img src={service.icon} alt={title} />
                          </div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                        </div>
                        <div className="!text-gray-600 text-sm mb-4 flex-grow">{description}</div>
                        <Link
                          href={`/${locale}/services/${service._id || ""}`}
                          className={`text-sm font-medium text-gray-700 hover:text-[#C026D3] inline-flex items-center ${
                            isRTL ? "" : ""
                          }`}
                        >
                          {t("workWithUs")}
                          <svg
                            className={`${isRTL ? "mr-1 rotate-180" : "ml-1"} w-4 h-4`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">{t("noServices")}</p>
              </div>
            )}
          </div>
        </Flex>
      </MaxWidthWrapper>

      <style jsx global>{`
        .services-swiper {
          padding-bottom: 48px;
        }

        .services-swiper .swiper-pagination {
          position: relative;
          bottom: 0;
          margin-top: 24px;
        }

        .services-swiper .swiper-pagination-bullet {
          opacity: 0.5;
          background-color: #94a3b8;
          margin: 0 4px;
        }

        .services-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
