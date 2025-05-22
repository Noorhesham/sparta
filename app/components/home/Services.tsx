"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Flex from "@/app/components/defaults/Flex";
import { ServiceType } from "@/app/types/homepage";
import Link from "next/link";
import { useTranslations } from "next-intl";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Paragraph from "../defaults/Paragraph";

interface ServicesProps {
  data?: ServiceType[];
  locale?: string;
}

export default function Services({ data = [], locale = "en" }: ServicesProps) {
  const t = useTranslations("Services");
  const isRTL = locale === "ar";

  // Default services if no data is provided
  const services = data;

  // Custom pagination rendering
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className} ${
        index === 0 ? "!w-8 !bg-[#C026D3]" : "!w-2"
      } !h-2 !rounded-full !mx-1 !transition-all !duration-300"></span>`;
    },
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
              {services.map((service, index) => {
                const title = service.title[locale as keyof typeof service.title] || "";
                const getBgColor = () => {
                  if (title.includes("Interaction")) return "#A5F3FC50";
                  if (title.includes("UX")) return "#E0E7FF50";
                  if (title.includes("Interface")) return "#FCE7F350";
                  return "#F3F4F650";
                };

                return (
                  <SwiperSlide className="h-full" key={index}>
                    <div
                      className="bg-white min-h-52 rounded-lg p-6 !h-full flex flex-col shadow-sm"
                      style={{ backgroundColor: getBgColor() }}
                    >
                      <div className="flex h-full items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-md flex items-center justify-center mb-4"
                          style={{ backgroundColor: getBgColor() }}
                        >
                          <img src={service.icon} alt="" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                      </div>
                      <Paragraph
                        isHtml
                        content={service.description[locale as keyof typeof service.description]}
                        locale={locale}
                        className="!text-gray-600 text-sm mb-4 flex-grow"
                      />
                      <Link
                        href={service.link}
                        className={`text-sm font-medium text-gray-700 hover:text-[#C026D3] inline-flex items-center ${
                          isRTL ? "" : ""
                        }`}
                      >
                        {service.linkText[locale as keyof typeof service.linkText] || t("workWithUs")}
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
