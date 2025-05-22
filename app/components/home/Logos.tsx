"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LogoType } from "@/app/types/homepage";

interface LogosProps {
  data?: LogoType[];
  locale?: string;
}

export default function Logos({ data = [], locale = "en" }: LogosProps) {
  const logos = data.length
    ? data
    : [
        { image: "/logos/logo1.png", name: "Breakthrough" },
        { image: "/logos/logo2.png", name: "Owl" },
        { image: "/logos/logo3.png", name: "AdClipse" },
        { image: "/logos/logo4.png", name: "PJC Bridge" },
        { image: "/logos/logo5.png", name: "ClickOrder" },
        { image: "/logos/logo6.png", name: "TechMate" },
      ];

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const speed = 1.2; // ✅ Faster for mobile
  const position = useRef(0);

  const step = () => {
    if (!scrollRef.current) return;

    position.current -= speed;

    const scrollWidth = scrollRef.current.scrollWidth / 2;

    if (Math.abs(position.current) >= scrollWidth) {
      position.current = 0;
    }

    scrollRef.current.style.transform = `translateX(${position.current}px)`;
    requestRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <section className="bg-slate-950 overflow-hidden relative">
      <div ref={containerRef} className="relative w-full overflow-hidden h-[100px] m-auto max-w-7xl">
        <div className="absolute w-full h-full">
          <div ref={scrollRef} className="flex items-center justify-center gap-12 min-w-max will-change-transform">
            {[...logos, ...logos].map((logo, i) => (
              <div key={`logo-${i}`} className="relative m-auto self-center  mt-5 h-16 w-28 flex-shrink-0">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={112} // 28 * 4
                  height={64}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
