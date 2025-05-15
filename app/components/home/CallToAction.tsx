"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import MotionItem from "@/app/components/defaults/MotionItem";
import Button from "@/app/components/defaults/Button";
import Lines from "./Lines";

interface CallToActionProps {
  locale?: string;
}

const CallToAction = ({ locale = "en" }: CallToActionProps) => {
  return (
    <section className="bg-[#0F172A] relative overflow-hidden ">
      {/* Colorful vertical lines */}

      <MaxWidthWrapper className="relative z-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <MotionItem
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="  relative flex justify-center items-center mt-10 md:mt-0"
          >
            <div className="relative">
              <Image
                src="/iPhone.png"
                alt="Mobile app interface"
                width={350}
                height={600}
                className="object-contain drop-shadow-2xl"
                priority
              />
              <img src="/Shapes (2).svg " className="absolute z-[-1] -bottom-2 -right-44" />
            </div>
          </MotionItem>
          {/* Content */}
          <div className="w-full md:w-1/2 text-white">
            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Make your projects come true with us</h2>
            </MotionItem>

            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-300 mb-8">
                Contact us now and let your ideas turn into successful projects on the reality
              </p>
            </MotionItem>

            <MotionItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/contact"
                className="rounded-full bg-white text-[#111827] px-6 py-3 font-medium hover:bg-gray-200 transition-colors"
              >
                Get Started Now
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center text-white rounded-full px-6 py-3 hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Contact Us
              </Link>
            </MotionItem>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default CallToAction;
