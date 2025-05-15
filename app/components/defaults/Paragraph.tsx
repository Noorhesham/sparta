import React from "react";
import { convertToHTML } from "@/app/utils/helpers";

interface ParagraphProps {
  content: string;
  locale: string;
  isHtml?: boolean;
  className?: string;
}
const Paragraph = ({ content, locale, isHtml = false, className }: ParagraphProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: isHtml ? content : convertToHTML(content) }}
      className={` text-white font-[400] text-lg max-w-[31rem] ${className}`}
    />
  );
};

export default Paragraph;
