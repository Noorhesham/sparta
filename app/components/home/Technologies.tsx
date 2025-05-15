"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Flex from "@/app/components/defaults/Flex";
import { TechnologyType } from "@/app/types/homepage";
import { motion } from "framer-motion";
import MotionContainer from "../defaults/MotionContainer";
import Image from "next/image";

interface TechnologiesProps {
  data?: TechnologyType[];
  locale?: string;
}

export default function Technologies({ data = [], locale = "en" }: TechnologiesProps) {
  // Use the first technology name as default active tab if available
  const defaultTab = data.length > 0 ? data[0].name.toLowerCase().trim() : "";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Get current active technology
  const activeTechnology = data.find((tech) => tech.name.toLowerCase().trim() === activeTab);

  // Positions for technology icons in a radial pattern
  const iconPositions = [
    { top: "10%", left: "10%" },
    { top: "15%", right: "15%" },
    { top: "30%", left: "5%" },
    { top: "40%", right: "8%" },
    { bottom: "30%", left: "12%" },
    { bottom: "25%", right: "10%" },
    { bottom: "10%", left: "30%" },
    { bottom: "5%", right: "25%" },
  ];

  return (
    <section className="bg-white">
      <MaxWidthWrapper>
        <Flex direction="col" gap="xl">
          <h2 className="text-3xl font-bold text-gray-900">Technologies we use</h2>

          <Flex direction="row" gap="2xl" className="w-full justify-between">
            <div className="w-full lg:w-[45%]">
              {data.length > 0 && (
                <Tabs defaultValue={defaultTab} className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="w-full grid grid-cols-4 bg-slate-50 p-1 rounded-lg">
                    {data.map((tech) => (
                      <TabsTrigger
                        key={tech.name}
                        value={tech.name.toLowerCase().trim()}
                        className="rounded-md data-[state=active]:bg-gray-100 !text-black data-[state=active]:shadow-sm"
                      >
                        {tech.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {data.map((tech) => (
                    <TabsContent key={tech.name} value={tech.name.toLowerCase().trim()} className="mt-6">
                      <MotionContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {tech.images.slice(0, 4).map((image, index) => (
                          <motion.div key={`row1-${index}`} className="flex items-center justify-center h-20">
                            <img
                              src={image}
                              alt={`${tech.name} technology ${index + 1}`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </motion.div>
                        ))}
                      </MotionContainer>
                      {tech.images.length > 4 && (
                        <MotionContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
                          {tech.images.slice(4, 8).map((image, index) => (
                            <motion.div key={`row2-${index}`} className="flex items-center justify-center h-20">
                              <img
                                src={image}
                                alt={`${tech.name} technology ${index + 5}`}
                                className="max-w-full max-h-full object-contain"
                              />
                            </motion.div>
                          ))}
                        </MotionContainer>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>

            <div className="relative h-80 lg:w-[45%] items-center justify-center">
              <Image src="/chart.png" className="object-contain" alt="Technology chart" fill />

              {/* Technology icons positioned radially around the chart */}
              {activeTechnology?.images.slice(0, Math.min(8, activeTechnology.images.length)).map((image, index) => (
                <motion.div
                  key={`icon-${index}`}
                  className="absolute z-10 bg-white rounded-lg shadow-md p-2 w-14 h-14 flex items-center justify-center"
                  style={iconPositions[index % iconPositions.length]}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <img
                    src={image}
                    alt={`${activeTechnology.name} ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </Flex>
        </Flex>
      </MaxWidthWrapper>
    </section>
  );
}
