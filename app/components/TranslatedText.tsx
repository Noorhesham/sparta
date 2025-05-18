import React from "react";
import { useLocale } from "next-intl";
const TranslatedText = ({ title }: { title: string }) => {
  const locale = useLocale();
  return <div>{locale === "ar" ? title?.name_ar : title?.name_en}</div>;
};

export default TranslatedText;
