"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const MotionItem = ({
  children,
  className,
  variants,
  initial,
  animate,
  exit,
  whileInView,
  nohover = true,
  transition,
  onMouseEnter,
  onMouseLeave,
  style,
  onTouchStart,
  onTouchEnd,
  viewport,
}: {
  nohover?: boolean;
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  initial?: any;
  animate?: any;
  exit?: any;
  whileInView?: any;
  transition?: any;
  onMouseEnter?: any;
  onMouseLeave?: any;
  style?: any;
  onTouchStart?: any;
  onTouchEnd?: any;
  viewport?: any;
}) => {
  return (
    <motion.div
      style={style}
      onMouseEnter={onMouseEnter && onMouseEnter}
      onMouseLeave={onMouseLeave && onMouseLeave}
      whileHover={nohover ? {} : { y: -10 }}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      className={className}
      whileInView={whileInView}
      variants={animate ? undefined : variants}
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
};

export default MotionItem;
