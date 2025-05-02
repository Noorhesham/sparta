"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Language = () => {
  const [isPending, startTransition] = useTransition();
  const currentLocale = useLocale();
  const pathName = usePathname();

  const handleSelect = (value: string) => {
    if (value === currentLocale) return;

    startTransition(() => {
      let newPathName = pathName;

      if (pathName.startsWith(`/${currentLocale}`)) {
        newPathName = pathName.replace(`/${currentLocale}`, `/${value}`);
      } else {
        newPathName = `/${value}${pathName}`;
      }

      window.location.href = newPathName;
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={() => handleSelect("ar")} className="cursor-pointer flex items-center gap-2">
          <span className="font-cairo">العربية</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("en")} className="cursor-pointer flex items-center gap-2">
          <span className="font-cinzel">EN</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Language;
