"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface FlexProps {
  children: ReactNode;
  direction?: "row" | "col";
  gap?: "none" | "sm" | "md" | "lg" | "xl" | "2xl"; // 2xl is equivalent to 24px (6 in Tailwind)
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  className?: string;
}

const Flex = ({
  children,
  direction = "col",
  gap = "2xl", // Default to 24px spacing
  align = "start",
  justify = "start",
  wrap = false,
  className,
}: FlexProps) => {
  // Base styles for flex container
  const baseStyles = "flex";

  // Direction styles
  const directionStyles = {
    row: "flex-row",
    col: "flex-col",
  };

  // Gap styles with responsive values
  const gapStyles = {
    none: "gap-0",
    sm: "gap-2 md:gap-3", // 8px on mobile, 12px on desktop
    md: "gap-3 md:gap-4", // 12px on mobile, 16px on desktop
    lg: "gap-4 md:gap-5", // 16px on mobile, 20px on desktop
    xl: "gap-5 md:gap-6", // 20px on mobile, 24px on desktop
    "2xl": "gap-4 md:gap-6", // 16px on mobile, 24px on desktop (6 or 2xl in Tailwind)
  };

  // Alignment styles
  const alignStyles = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  // Justify styles
  const justifyStyles = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  // Wrap styles
  const wrapStyles = wrap ? "flex-wrap" : "flex-nowrap";

  // Combine all styles
  const flexClasses = cn(
    baseStyles,
    directionStyles[direction],
    gapStyles[gap],
    alignStyles[align],
    justifyStyles[justify],
    wrapStyles,
    className
  );

  return <div className={flexClasses}>{children}</div>;
};

export default Flex;
