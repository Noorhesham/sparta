"use client";
import type * as React from "react";
import {
  Home,
  Package,
  PlusCircle,
  FileText,
  FilePlus,
  Users,
  LayoutDashboard,
  LogOut,
  BriefcaseBusinessIcon,
  Settings,
  Mail,
  Users2,
  Circle,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { redirect, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getSiteSettings } from "../actions/actions";
import { useEffect, useState } from "react";
import Image from "next/image";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "management",
      url: "/dashboard",
      items: [
        {
          title: "home",
          url: "/dashboard",
          icon: Home,
        },
        {
          title: "home",
          url: "/dashboard/homepage",
          icon: Home,
        },
        {
          title: "products",
          url: "/dashboard/products",
          icon: Package,
        },
        {
          title: "createProduct",
          url: "/dashboard/products/create",
          icon: PlusCircle,
        },
        {
          title: "blogs",
          url: "/dashboard/blogs",
          icon: FileText,
        },
        {
          title: "createBlog",
          url: "/dashboard/blogs/create",
          icon: FilePlus,
        },
        {
          title: "services",
          url: "/dashboard/services",
          icon: Settings,
        },
        {
          title: "contact",
          url: "/dashboard/contact",
          icon: Mail,
        },
        {
          title: "team",
          url: "/dashboard/team",
          icon: Users2,
        },
        {
          title: "users",
          url: "/dashboard/user",
          icon: Users,
        },
        { title: "categories", url: "/dashboard/categories", icon: Circle },
        { title: "settings", url: "/dashboard/settings", icon: Settings },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const session = useSession();
  const [logoUrl, setLogoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("dashboard.sidebar");
  useEffect(() => {
    const fetchSettings = async () => {
      // Skip fetching if we already have settings

      try {
        setIsLoading(true);
        const result = await getSiteSettings();
        if (result.success && result.data && result.data.logo) {
          setLogoUrl(result.data.logo);
        }
      } catch (error) {
        console.error("Failed to load logo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {!isLoading && (
                <div className="relative h-10 w-32">
                  <Image src={logoUrl} alt="Sparta Logo" fill className="object-contain" priority />
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t(item.title)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="transition-colors duration-200"
                    >
                      <a href={item.url}>
                        {item.icon && <item.icon className="size-4" />}
                        <span>{t(item.title)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Admin User</span>
                  <span className="text-xs text-muted-foreground">{session.data?.user?.email}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                onClick={async () => {
                  await signOut();
                  redirect("/");
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                <span>{t("logout")}</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
