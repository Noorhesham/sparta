"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAnimationFrame } from "framer-motion";
import Image from "next/image";
import { LogoType } from "@/app/types/homepage";

interface LogosProps {
  data?: LogoType[];
  locale?: string;
}

export default function Logos({ data = [], locale = "en" }: LogosProps) {
  const logos =
    data.length > 0
      ? data
      : [
          { image: "/logos/logo1.png", name: "Breakthrough" },
          { image: "/logos/logo2.png", name: "Owl" },
          { image: "/logos/logo3.png", name: "AdClipse" },
          { image: "/logos/logo4.png", name: "PJC Bridge" },
          { image: "/logos/logo5.png", name: "ClickOrder" },
          { image: "/logos/logo6.png", name: "TechMate" },
        ];

  const [isReady, setIsReady] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const scrollWidth = useRef(0);
  const position = useRef(0);
  const speed = 1; // Adjust for faster/slower movement
  const totalImages = logos.length * 2; // Original + cloned set

  // Initialize animation only after all images are loaded
  useEffect(() => {
    if (loadedImages === totalImages && scrollRef.current && cloneRef.current) {
      scrollWidth.current = scrollRef.current.scrollWidth;
      cloneRef.current.style.transform = `translateX(${scrollWidth.current}px)`;
      setIsReady(true);
    }
  }, [loadedImages, totalImages]);

  // Animation loop
  useAnimationFrame(() => {
    if (!isReady || !scrollRef.current || !cloneRef.current) return;

    position.current -= speed;

    // Reset position for seamless looping
    if (position.current <= -scrollWidth.current) {
      position.current = 0;
    }

    scrollRef.current.style.transform = `translateX(${position.current}px)`;
    cloneRef.current.style.transform = `translateX(${position.current + scrollWidth.current}px)`;
  });

  return (
    <section className="bg-slate-950 overflow-hidden relative">
      <div className="relative w-full overflow-hidden h-[100px] mx-auto max-w-7xl">
        <div className="absolute w-full h-full flex">
          {/* Original logos */}
          <div
            ref={scrollRef}
            className="flex items-center gap-24 min-w-max"
            style={{ willChange: "transform" }}
          >
            {logos.map((logo, i) => (
              <div key={`logo-${i}`} className="relative h-16 w-32">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  fill
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                  onLoadingComplete={() => setLoadedImages(prev => prev + 1)}
                />
              </div>
            ))}
          </div>

          {/* Cloned logos */}
          <div
            ref={cloneRef}
            className="flex items-center gap-24 min-w-max"
            style={{ willChange: "transform" }}
          >
            {logos.map((logo, i) => (
              <div key={`logo-clone-${i}`} className="relative h-16 w-32">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  fill
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                  onLoadingComplete={() => setLoadedImages(prev => prev + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}