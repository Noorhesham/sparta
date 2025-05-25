"use client";

import React from "react";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import MotionItem from "@/app/components/defaults/MotionItem";
import Paragraph from "@/app/components/defaults/Paragraph";
import Flex from "@/app/components/defaults/Flex";
import Button from "@/app/components/defaults/Button";
import Image from "next/image";
import { AboutType } from "@/app/types/homepage";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

interface AboutProps {
  data?: AboutType;
  locale?: string;
}

const FeatureCard = ({
  color,
  title,
  description,
  label,
}: {
  color: string;
  title: string;
  description: string;
  label: string;
}) => {
  const colorClasses = {
    purple: "border-[#9333EA]",
    blue: "border-blue-500",
    green: "border-green-500",
  };

  const labelColorClasses = {
    purple: "text-[#9333EA]",
    blue: "text-blue-500",
    green: "text-green-500",
  };

  const buttonColorClasses = {
    purple: "border-[#9333EA] text-[#9333EA] hover:bg-[#9333EA]/5",
    blue: "border-blue-500 text-blue-500 hover:bg-blue-50",
    green: "border-green-500 text-green-500 hover:bg-green-50",
  };

  return (
    <div
      className={`rounded-lg bg-white p-5 shadow-md border-t-4 h-full ${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <div className="mb-1">
        <span className={`text-xs font-medium ${labelColorClasses[color as keyof typeof labelColorClasses]}`}>
          {label}
        </span>
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-xs text-gray-600 mb-4">{description}</p>
      <Button
        variant="outline"
        size="sm"
        className={`border text-xs py-1.5 ${buttonColorClasses[color as keyof typeof buttonColorClasses]} bg-white`}
      >
        Work with Us!
      </Button>
    </div>
  );
};

export default function About({ data, locale = "en" }: AboutProps) {
  const t = useTranslations("About");
  const isRTL = locale === "ar";

  return (
    <section className={`relative flex justify-center min-h-[75dvh] bg-white ${isRTL ? "rtl" : ""}`}>
      {" "}
      <img src="/starts.svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 w-40 -translate-y-1/2" alt="" />
      <MaxWidthWrapper className="flex items-center w-full">
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative flex flex-col gap-6 z-10">
            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className=""
            >
              <div className="relative">
                <h2 className="text-3xl w-fit relative md:text-5xl font-bold text-gray-900 lg:mb-8">
                  <span className=" text-black !mb-6">{data?.title?.[locale as keyof typeof data.title] || t("title")}</span>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
                    style={{ width: 127, overflow: "hidden" }}
                  >
                    <motion.svg
                      width="127"
                      height="20"
                      viewBox="0 0 127 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ strokeDashoffset: 300 }}
                      whileInView={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                      style={{ strokeDasharray: 300 }}
                      className="absolute -bottom-7 lg:block hidden right-10"
                    >
                      <path
                        d="M1.59088 8.14588C17.3933 6.12998 74.9142 2.20919 122.006 8.1459C97.5611 8.1459 65.7122 8.7462 45.2056 15"
                        stroke="#C026D3"
                        strokeWidth="10"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </motion.div>
                </h2>
              </div>{" "}
              <MotionItem
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xl md:text-2xl -mb-4 font-semibold text-gray-800">
                  {data?.miniTitle?.[locale as keyof typeof data.miniTitle] || t("subtitle")}
                </h3>
              </MotionItem>
            </MotionItem>

            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <Paragraph
                isHtml
                content={data?.description?.[locale as keyof typeof data.description] || ""}
                locale={locale}
                className="!text-gray-700"
              />
            </MotionItem>

            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href={`/${locale}/services`}
                className="text-[#C026D3] font-medium flex items-center gap-2 hover:underline"
              >
                {t("findMore")}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </MotionItem>
          </div>

          <div className="relative">
            <img src="/Blob.png" className="absolute top-20 right-[74%] w-80 hidden md:block" alt="" />

            <div className="relative   mb-10 md:mb-44">
              <MotionItem
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="overflow-hidden rounded-lg shadow-lg relative z-10"
              >
                <div className="relative w-full h-64 md:h-96">
                  {/* Browser-like header */}
                  <div className="absolute top-0 left-0 w-full h-8 bg-gray-100 rounded-t-lg z-20 flex items-center px-3 border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#9333EA]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#8ED4DD]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C026D3]"></div>
                    </div>
                  </div>

                  {/* Gradient background */}
                  <div className="bg-gradient-to-r from-[#9333EA] to-[#C026D3] w-full h-[40%] absolute top-8 left-0 z-0"></div>

                  {/* Image */}
                  <div className="absolute top-8 left-0 right-0 bottom-0 z-10">
                    <Image
                      src={data?.mainImage || "/team-image.jpg"}
                      alt={t("teamImageAlt")}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </MotionItem>

              {/* Feature cards */}
              <div className="hidden md:grid md:absolute md:-bottom-22 md:-left-20 md:right-10 md:translate-y-1/3 md:grid-cols-3 z-40 md:gap-3 md:px-2">
                <MotionItem
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <FeatureCard
                    color="purple"
                    label={t("features.performance.label")}
                    title={t("features.performance.title")}
                    description={t("features.performance.description")}
                  />
                </MotionItem>

                <MotionItem
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FeatureCard
                    color="blue"
                    label={t("features.support.label")}
                    title={t("features.support.title")}
                    description={t("features.support.description")}
                  />
                </MotionItem>

                <MotionItem
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FeatureCard
                    color="green"
                    label={t("features.innovative.label")}
                    title={t("features.innovative.title")}
                    description={t("features.innovative.description")}
                  />
                </MotionItem>
              </div>

              {/* Mobile-only feature cards */}
              <div className="grid grid-cols-1 gap-4 mt-8 md:hidden">
                <MotionItem
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <FeatureCard
                    color="purple"
                    label={t("features.performance.label")}
                    title={t("features.performance.title")}
                    description={t("features.performance.description")}
                  />
                </MotionItem>

                <MotionItem
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FeatureCard
                    color="blue"
                    label={t("features.support.label")}
                    title={t("features.support.title")}
                    description={t("features.support.description")}
                  />
                </MotionItem>

                <MotionItem
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FeatureCard
                    color="green"
                    label={t("features.innovative.label")}
                    title={t("features.innovative.title")}
                    description={t("features.innovative.description")}
                  />
                </MotionItem>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
