import type { Metadata } from "next";
import "../globals.css";
import { Poppins, Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "../components/NavBar";
import Footer from "../components/layouts/Footer";
import React from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Sparta",
  description: "Your Trusted Partner For Programming Services",
};

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({ locale });
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${cairo.variable} ${poppins.variable}`}
    >
      <body className={`${isArabic ? cairo.className : poppins.className} !bg-bg relative`}>
        {/* Top radial gradient */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7E22CE]/20"
            style={{
              filter: "blur(150px)",
              borderRadius: "50%",
              transform: "translate(10%, -30%)",
            }}
          ></div>
        </div>

        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Navbar />
            <div className="pt-10 relative z-[1]">{children}</div>
            <Footer locale={locale} />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
