"use client";
import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const ModelCustom = ({
  text,
  onClick,
  title,
  btn,
  content,
  isOpen = false,
}: {
  value?: any;
  className?: string;
  text?: string;
  onClick?: any;
  create?: boolean;
  title?: string;
  btn?: ReactNode;
  content: ReactNode;
  isOpen?: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{btn}</DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] max-h-[80vh] overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{text}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ModelCustom;
