"use client";

import Link from "next/link";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import MotionItem from "@/app/components/defaults/MotionItem";
import Image from "next/image";
import { HeroType } from "@/app/types/homepage";
import Paragraph from "@/app/components/defaults/Paragraph";
import Flex from "@/app/components/defaults/Flex";
import Button from "@/app/components/defaults/Button";
import { motion } from "framer-motion";
import Lines from "./Lines";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface HeroProps {
  data?: HeroType;
  locale?: string;
}

export default function Hero({ data, locale = "en" }: HeroProps) {
  const t = useTranslations("Hero");
  const isRTL = locale === "ar";
  const [lineWidth, setLineWidth] = useState(127);
  const [linePosition, setLinePosition] = useState("right-40");

  // Adjust line dimensions based on screen size
  useEffect(() => {
    const updateLineDimensions = () => {
      if (window.innerWidth < 640) {
        // Mobile
        setLineWidth(80);
        setLinePosition(isRTL ? "left-8" : "right-8");
      } else if (window.innerWidth < 768) {
        // Small tablets
        setLineWidth(100);
        setLinePosition(isRTL ? "left-16" : "right-16");
      } else if (window.innerWidth < 1024) {
        // Tablets/small laptops
        setLineWidth(120);
        setLinePosition(isRTL ? "left-24" : "right-24");
      } else {
        // Desktop
        setLineWidth(127);
        setLinePosition(isRTL ? "left-40" : "right-40");
      }
    };

    // Initial call
    updateLineDimensions();

    // Add event listener
    window.addEventListener("resize", updateLineDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateLineDimensions);
  }, [isRTL]);

  return (
    <section className={`relative overflow-hidden lg:pt-0 pt-20 pb-20 ${isRTL ? "rtl" : ""}`}>
      <MaxWidthWrapper className="relative grid grid-cols-1 md:grid-cols-2 ">
        {/* Background SVG animation */}
        <div className="absolute w-[30rem] left-0 top-0 z-10">
          <MotionItem
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute right-0 top-0 w-[412px] h-[414px]"
          >
            <Image src="/Group 458.svg" alt={t("backgroundAlt")} width={412} height={414} className="w-full h-auto" />
          </MotionItem>
        </div>

        <div className="relative z-10">
          <Flex gap="2xl" className="max-w-2xl">
            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              <h1 className="text-[3.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] leading-tight font-bold">
                <span className="bg-gradient-to-r from-[#8ED4DD] via-[#7E22CE] to-[#8ED4DD] bg-clip-text text-transparent">
                  {t("companyName")}
                </span>{" "}
                <span className="text-white relative">
                  {data?.title?.[locale as keyof typeof data.title] || t("trustedPartner")}
                  <div className={`absolute -bottom-1 sm:-bottom-2 ${linePosition}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
                      style={{ width: lineWidth, overflow: "hidden" }}
                      className="w-full"
                    >
                      <motion.svg
                        width="100%"
                        height="20"
                        viewBox={`0 0 ${lineWidth} 20`}
                        preserveAspectRatio="none"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        initial={{ strokeDashoffset: 300 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                        style={{ strokeDasharray: 300 }}
                      >
                        <path
                          d={`M1 8.15C${lineWidth * 0.14} 6.13 ${lineWidth * 0.6} 2.21 ${lineWidth * 0.96} 8.15C${
                            lineWidth * 0.77
                          } 8.15 ${lineWidth * 0.52} 8.75 ${lineWidth * 0.36} 15`}
                          stroke="#C026D3"
                          strokeWidth="10"
                          strokeLinejoin="round"
                        />
                      </motion.svg>
                    </motion.div>
                  </div>
                </span>
              </h1>
            </MotionItem>

            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-bold">
                {data?.subtitle?.[locale as keyof typeof data.subtitle] || t("forProgramming")}
              </h2>
            </MotionItem>

            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full"
            >
              <Paragraph
                isHtml
                content={data?.description?.[locale as keyof typeof data.description] || ""}
                locale={locale}
              />
            </MotionItem>

            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4"
              nohover={false}
            >
              <Button href={`/${locale}${data?.buttonLink || "#contact"}`} size="lg">
                {data?.buttonText?.[locale as keyof typeof data.buttonText] || t("contactUs")}
              </Button>
            </MotionItem>
          </Flex>
        </div>

        {/* Phone image */}
        <MotionItem
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="relative flex justify-center items-center mt-10 md:mt-0"
        >
          <div className="relative">
            <Image
              src="/iPhone.png"
              alt={t("mobileAppAlt")}
              width={350}
              height={600}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </MotionItem>
      </MaxWidthWrapper>{" "}
      <MaxWidthWrapper className="relative flex justify-center items-center mt-20">
        <img src="/Macbook.svg" alt={t("macbookAlt")} className="object-contain" />
        <div>
          <svg
            width="182"
            height="800"
            className="absolute  left-[55%] w-[94%] scale-[110%] -translate-x-1/2 translate-20 z-[-1]"
            viewBox="0 0 192 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="30" height="875" fill="#9333EA" />
            <rect x="80" width="30" height="875" fill="#8ED4DD" />
            <rect x="160" width="30" height="875" fill="#C026D3" />
          </svg>
        </div>
      </MaxWidthWrapper>{" "}
      <Lines />
    </section>
  );
}
