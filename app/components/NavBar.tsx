"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./defaults/MaxWidthWrapper";
import { usePathname, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import LangSwitcher from "./LangSwitcher";
import Image from "next/image";
import { getSiteSettings } from "@/app/actions/actions";

interface NavbarProps {
  initialSettings?: {
    logo?: string;
    [key: string]: any;
  };
}

export default function Navbar({ initialSettings }: NavbarProps = {}) {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const t = useTranslations("Navbar");
  const isRTL = locale === "ar";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialSettings?.logo || "");
  const [isLoading, setIsLoading] = useState(!initialSettings?.logo);

  // Fetch site settings if not provided in props
  useEffect(() => {
    const fetchSettings = async () => {
      // Skip fetching if we already have settings
      if (initialSettings?.logo) {
        return;
      }

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
  }, [initialSettings]);

  // Don't render navbar on dashboard page
  if (pathname?.includes("/dashboard")) {
    return null;
  }

  const navItems = [
    { name: t("home"), href: `/${locale}` },
    { name: t("about"), href: `/${locale}/about` },
    { name: t("services"), href: `/${locale}/services` },
    { name: t("portfolio"), href: `/${locale}/portfolio` },
    { name: t("blog"), href: `/${locale}/blog` },
    { name: t("contact"), href: `/${locale}/contact` },
  ];

  const isActiveLink = (href: string) => {
    // For home page
    if (href === `/${locale}` && pathname === `/${locale}`) return true;

    // For other pages
    // Check if pathname starts with href, accounting for nested routes
    if (href !== `/${locale}` && pathname?.startsWith(href)) return true;

    // Alternative check for when pathname has additional segments
    const hrefWithoutLocale = href.replace(new RegExp(`^/${locale}`), "");
    const pathnameWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "");
    if (hrefWithoutLocale && pathnameWithoutLocale.startsWith(hrefWithoutLocale)) return true;

    return false;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Animation variants for the menu
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  // Animation variants for menu items
  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <nav className={`w-full fixed top-0 z-50 bg-black/50 backdrop-blur-sm py-4 ${isRTL ? "rtl" : "ltr"}`}>
      <MaxWidthWrapper noPadding className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/${locale}`} className={`${isRTL ? "ml-12" : "mr-12"}`}>
            {logoUrl ? (
              <div className="relative h-10 w-32">
                <Image src={logoUrl} alt="Sparta Logo" fill className="object-contain" priority />
              </div>
            ) : (
              <span className="text-2xl font-bold">
                <span className="text-[#8a70d6]">Sparta</span>
              </span>
            )}
          </Link>
          <LangSwitcher locale={locale} />
          <ul className="hidden md:flex items-center gap-4   rtl:space-x-reverse">
            {navItems.map((item) => (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActiveLink(item.href) ? "text-[#d359ff]" : "text-white hover:text-[#8a70d6]"
                  )}
                >
                  {item.name}
                  {isActiveLink(item.href) && (
                    <div className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-[#8a70d6] to-[#d359ff] rounded-full" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link
            href={`/${locale}/contact`}
            className="hidden md:inline-flex items-center justify-center rounded-full border border-white px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {t("contact")}
          </Link>
          <Link
            href={`/${locale}/services`}
            className="hidden md:inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-medium text-[#121628] transition-colors hover:bg-white/90"
          >
            {t("getStarted")}
          </Link>

          {/* Mobile Get Started button */}
          <Link
            href={`/${locale}/about`}
            className="md:hidden inline-flex items-center justify-center rounded-full bg-white px-2 text-nowrap py-1.5 text-xs font-medium text-[#121628] transition-colors hover:bg-white/90"
          >
            {t("getStartedMobile")}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 bg-white block"
            ></motion.span>
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 bg-white block"
            ></motion.span>
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 bg-white block"
            ></motion.span>
          </button>
        </div>
      </MaxWidthWrapper>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden h-screen fixed inset-0 bg-[#121628]/95 z-40 flex flex-col items-center justify-center"
          >
            <motion.ul className={`flex flex-col items-center space-y-6 w-full px-12 ${isRTL ? "rtl" : "ltr"}`}>
              {navItems.map((item) => (
                <motion.li key={item.name} variants={itemVariants} className="w-full">
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block text-center text-lg font-medium py-2 border-b border-white/10 w-full",
                      isActiveLink(item.href) ? "text-[#d359ff] border-[#d359ff]" : "text-white hover:text-[#8a70d6]"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants} className="w-full pt-4">
                <Link
                  href={`/${locale}/contact`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 w-full"
                >
                  {t("contact")}
                </Link>
              </motion.li>
              <motion.li variants={itemVariants} className="w-full pt-2 flex justify-center">
                <LangSwitcher locale={locale} />
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
