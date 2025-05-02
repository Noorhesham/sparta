import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import Language from "@/app/components/Language";
import { ModeToggle } from "@/components/mode-toggle";
import SessionProviderClient from "@/app/components/SessionProviderClient";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function DashboardLayout({ children, params }: LayoutProps) {
  const locale = params.locale || "en";

  return (
    <main className="w-full">
      <SessionProviderClient>
        <SidebarProvider>
          <AppSidebar className="z-[50]" side={locale === "en" ? "left" : "right"} />
          <div className="flex w-full flex-col">
            <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <h1 className="text-xl font-semibold">Sparta</h1>
              </div>
              <div className="flex items-center gap-4">
                <ModeToggle />
                <Language />
              </div>
            </header>
            <SidebarInset className="w-full">{children}</SidebarInset>
          </div>
        </SidebarProvider>
      </SessionProviderClient>
    </main>
  );
}
