"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  isExternal?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  isExternal = false,
  ...props
}: ButtonProps) => {
  const baseStyles = "rounded-full font-medium transition-colors inline-flex items-center justify-center";

  const variantStyles = {
    primary: "bg-white hover:bg-gray-100 text-slate-900",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white",
    outline: "bg-transparent border border-white text-white hover:bg-white/10",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const buttonClasses = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  // If href is provided, render as Link
  if (href) {
    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses}>
        {children}
      </a>
    ) : (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
