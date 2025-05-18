"use client";

import React from "react";
import MaxWidthWrapper from "../defaults/MaxWidthWrapper";
import MotionItem from "../defaults/MotionItem";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

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

const VisionMission = ({ data, locale = "en" }: VisionMissionProps) => {
  const t = useTranslations("VisionMission");
  const isRTL = locale === "ar";

  // Use translation data if no specific data is provided
  const defaultData = {
    vision: {
      title: t("vision.title"),
      description: t("vision.description"),
      color: "#c084fc", // Purple
    },
    mission: {
      title: t("mission.title"),
      description: t("mission.description"),
      color: "#67e8f9", // Cyan
    },
    values: {
      title: t("values.title"),
      description: t("values.description"),
      color: "#c084fc", // Purple
    },
  };

  // Use provided data or fallback to translated data
  const visionData = data?.vision || defaultData.vision;
  const missionData = data?.mission || defaultData.mission;
  const valuesData = data?.values || defaultData.values;

  return (
    <section
      className={`relative min-h-[60dvh] flex items-center overflow-hidden ${isRTL ? "rtl" : "ltr"}`}
      style={{
        background: "linear-gradient(to right, #0f172a, #1e293b, #0f172a)",
      }}
    >
      {/* Background lines */}
      <MaxWidthWrapper noPadding className="absolute !w-fit inset-0 flex gap-44 z-0">
        <div className="w-4 h-full" style={{ background: visionData.color }}></div>
        <div className="w-4 h-full" style={{ background: missionData.color }}></div>
        <div className="w-4 h-full" style={{ background: valuesData.color }}></div>
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
                  borderColor: visionData.color,
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2), 0 0 0 1px ${visionData.color}30`,
                }}
              >
                <h3 className="text-2xl font-bold text-white">{visionData.title}</h3>
              </div>

              {/* Back Card */}
              <div
                className="absolute backface-hidden rotate-y-180 w-full h-full p-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2)`,
                }}
              >
                <p className="text-center text-sm" style={{ color: visionData.color }}>
                  "{visionData.description}"
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
                  borderColor: missionData.color,
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2), 0 0 0 1px ${missionData.color}30`,
                }}
              >
                <h3 className="text-2xl font-bold text-white">{missionData.title}</h3>
              </div>

              {/* Back Card */}
              <div
                className="absolute backface-hidden rotate-y-180 w-full h-full p-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2)`,
                }}
              >
                <p className="text-center text-sm" style={{ color: missionData.color }}>
                  "{missionData.description}"
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
                  borderColor: valuesData.color,
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2), 0 0 0 1px ${valuesData.color}30`,
                }}
              >
                <h3 className="text-2xl font-bold text-white">{valuesData.title}</h3>
              </div>

              {/* Back Card */}
              <div
                className="absolute backface-hidden rotate-y-180 w-full h-full p-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "white",
                  boxShadow: `0 0 20px rgba(0, 0, 0, 0.2)`,
                }}
              >
                <p className="text-center text-sm" style={{ color: valuesData.color }}>
                  "{valuesData.description}"
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
