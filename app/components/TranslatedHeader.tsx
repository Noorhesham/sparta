"use client";
import { useTranslations } from "next-intl";
import React from "react";

interface TranslatedHeaderProps {
  title: string;
  values?: Record<string, string | number>;
}

const TranslatedHeader = ({ title, values }: TranslatedHeaderProps) => {
  // Extract namespace from the title path
  const lastDotIndex = title.lastIndexOf(".");
  const namespace = lastDotIndex !== -1 ? title.substring(0, lastDotIndex) : "";
  const key = lastDotIndex !== -1 ? title.substring(lastDotIndex + 1) : title;

  const t = useTranslations(namespace);

  return <span>{values ? t(key, values) : t(key)}</span>;
};

export default TranslatedHeader;
