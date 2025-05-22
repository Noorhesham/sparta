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
import SideBar from "../components/SideBar";
import { getSiteSettings } from "../actions/actions";
import { cache } from "react";
import Script from "next/script";

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

// Cache the site settings using React's cache function for better performance
const getSiteSettingsCached = cache(async () => {
  const settingsResult = await getSiteSettings();

  // Return data or empty object to avoid null
  return settingsResult.success ? settingsResult.data : {};
});

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate the locale to ensure it's one of our supported locales
  const validatedLocale = ["en", "ar"].includes(locale) ? locale : "en";

  const messages = await getMessages({ locale: validatedLocale });
  const isArabic = validatedLocale === "ar";

  // Get cached site settings
  const siteSettings = await getSiteSettingsCached();

  // timeZone is required for proper Next-intl functionality
  const now = new Date();

  return (
    <html
      lang={validatedLocale}
      dir={isArabic ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${cairo.variable} ${poppins.variable}`}
    >
      <head>
        {/* Client-side script to prevent flickering when changing languages */}
        <Script id="language-switcher-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                // Check if there's a stored locale preference
                const storedLocale = sessionStorage.getItem('preferredLocale');
                const currentLocale = "${validatedLocale}";
                
                // If there's a preference and it's different from current locale, redirect
                if (storedLocale && storedLocale !== currentLocale) {
                  // Get current path without locale prefix
                  const path = window.location.pathname.replace(/^\/(ar|en)/, '') || '/';
                  // Construct new path with preferred locale
                  const newPath = '/' + storedLocale + path;
                  
                  // Only redirect if we're not already in a redirecting state
                  if (!sessionStorage.getItem('isRedirecting')) {
                    sessionStorage.setItem('isRedirecting', 'true');
                    window.location.replace(newPath);
                  } else {
                    // Clear the redirecting flag to prevent redirect loops
                    sessionStorage.removeItem('isRedirecting');
                  }
                }
              } catch (e) {
                console.error('Language switcher script error:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body className={`${isArabic ? cairo.className : poppins.className} !bg-bg relative`}>
        {/* Top radial gradient */}
        <SideBar siteSettings={siteSettings} />
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
          <NextIntlClientProvider locale={validatedLocale} messages={messages} timeZone="UTC" now={now}>
            {/* Pass the site settings as props to avoid refetching */}
            <Navbar initialSettings={siteSettings} />
            <div className="pt-10 relative z-[1]">{children}</div>
            <Footer locale={validatedLocale} />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
