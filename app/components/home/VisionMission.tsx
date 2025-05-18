"use client";

import React from "react";
import MaxWidthWrapper from "../defaults/MaxWidthWrapper";
import MotionItem from "../defaults/MotionItem";
import { motion } from "framer-motion";
import Image from "next/image";

interface VisionMissionItem {
  title: string;
  description: string;
  color: string;
}

interface VisionMissionProps {
  data?: {
    vision?: VisionMissionItem;
    mission?: VisionMissionItem;
    values?: VisionMissionItem;
  };
  locale?: string;
}

const VisionMission = ({
  data = {
    vision: {
      title: "Vision",
      description:
        "To create technology that simplifies processes, solves complex challenges, and adds value to businesses and communities.",
      color: "#c084fc", // Purple
    },
    mission: {
      title: "Mission",
      description:
        "To be a global leader in innovative software solutions, empowering businesses with cutting-edge technology. We strive to set new industry standards through creativity and excellence.",
      color: "#67e8f9", // Cyan
    },
    values: {
      title: "Values",
      description:
        "To develop high-quality, scalable, and secure software that drives digital transformation and enhances business efficiency. Our goal is to provide tailored solutions that meet evolving market needs.",
      color: "#c084fc", // Purple
    },
  },
  locale = "en",
}: VisionMissionProps) => {
  return (
    <section
      className="relative min-h-[60dvh] flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(to right, #0f172a, #1e293b, #0f172a)",
      }}
    >
      {/* Background lines */}
      <MaxWidthWrapper noPadding className="absolute !w-fit inset-0 flex  gap-44 z-0">
        <div className="w-4 h-full" style={{ background: data.vision?.color || "#c084fc" }}></div>
        <div className="w-4 h-full" style={{ background: data.mission?.color || "#67e8f9" }}></div>
        <div className="w-4 h-full" style={{ background: data.values?.color || "#c084fc" }}></div>
      </MaxWidthWrapper>

      <MaxWidthWrapper>
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {/* Vision Card */}
          <MotionItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group perspective h-80"
          >
            <div className="relative preserve-3d w-full h-full duration-700 group-hover:rotate-y-180">
              {/* Front Card */}
              <div
                className="absolute backface-hidden w-full h-full p-6 flex items-center justify-center rounded-lg border border-opacity-20"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(10px)",
                  borderColor: data.vision?.color || "#c084fc",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2), 0 0 0 1px ${data.vision?.color || "#c084fc"}30`,
                }}
              >
                <h3 className="text-2xl font-bold text-white">{data.vision?.title}</h3>
              </div>

              {/* Back Card */}
              <div
                className="absolute backface-hidden rotate-y-180 w-full h-full p-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2)`,
                }}
              >
                <p className="text-center text-sm" style={{ color: data.vision?.color || "#c084fc" }}>
                  "{data.vision?.description}"
                </p>
              </div>
            </div>
          </MotionItem>

          {/* Mission Card */}
          <MotionItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="group perspective h-80"
          >
            <div className="relative preserve-3d w-full h-full duration-700 group-hover:rotate-y-180">
              {/* Front Card */}
              <div
                className="absolute backface-hidden w-full h-full p-6 flex items-center justify-center rounded-lg border border-opacity-20"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(10px)",
                  borderColor: data.mission?.color || "#67e8f9",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2), 0 0 0 1px ${data.mission?.color || "#67e8f9"}30`,
                }}
              >
                <h3 className="text-2xl font-bold text-white">{data.mission?.title}</h3>
              </div>

              {/* Back Card */}
              <div
                className="absolute backface-hidden rotate-y-180 w-full h-full p-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2)`,
                }}
              >
                <p className="text-center text-sm" style={{ color: data.mission?.color || "#67e8f9" }}>
                  "{data.mission?.description}"
                </p>
              </div>
            </div>
          </MotionItem>

          {/* Values Card */}
          <MotionItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="group perspective h-80"
          >
            <div className="relative preserve-3d w-full h-full duration-700 group-hover:rotate-y-180">
              {/* Front Card */}
              <div
                className="absolute backface-hidden w-full h-full p-6 flex items-center justify-center rounded-lg border border-opacity-20"
                style={{
                  background: "rgba(15, 23, 42, 0.6)",
                  backdropFilter: "blur(10px)",
                  borderColor: data.values?.color || "#c084fc",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2), 0 0 0 1px ${data.values?.color || "#c084fc"}30`,
                }}
              >
                <h3 className="text-2xl font-bold text-white">{data.values?.title}</h3>
              </div>

              {/* Back Card */}
              <div
                className="absolute backface-hidden rotate-y-180 w-full h-full p-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2)`,
                }}
              >
                <p className="text-center text-sm" style={{ color: data.values?.color || "#c084fc" }}>
                  "{data.values?.description}"
                </p>
              </div>
            </div>
          </MotionItem>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default VisionMission;
