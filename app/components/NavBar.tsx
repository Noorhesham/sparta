"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./defaults/MaxWidthWrapper";
import { usePathname, useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  const isValidLocale = locale === "en" || locale === "ar";
  const safeLocale = isValidLocale ? locale : "en";

  const t = useTranslations("Navbar");
  const isRTL = safeLocale === "ar";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialSettings?.logo || "");
  const [isLoading, setIsLoading] = useState(!initialSettings?.logo);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to handle menu toggle
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  // Cleanup effect for body scroll
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
    { name: t("home"), href: `/${safeLocale}` },
    { name: t("about"), href: `/${safeLocale}/about` },
    { name: t("services"), href: `/${safeLocale}/services` },
    { name: t("portfolio"), href: `/${safeLocale}/portfolio` },
    { name: t("blog"), href: `/${safeLocale}/blog` },
    { name: t("contact"), href: `/${safeLocale}/contact` },
  ];

  const isActiveLink = (href: string) => {
    // For home page
    if (href === `/${safeLocale}` && pathname === `/${safeLocale}`) return true;

    // For other pages
    // Check if pathname starts with href, accounting for nested routes
    if (href !== `/${safeLocale}` && pathname?.startsWith(href)) return true;

    // Alternative check for when pathname has additional segments
    const hrefWithoutLocale = href.replace(new RegExp(`^/${safeLocale}`), "");
    const pathnameWithoutLocale = pathname.replace(new RegExp(`^/${safeLocale}`), "");
    if (hrefWithoutLocale && pathnameWithoutLocale.startsWith(hrefWithoutLocale)) return true;

    return false;
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
    <nav
      className={cn(
        "w-full fixed top-0 z-50 transition-all duration-300",
        hasScrolled ? "bg-black/80 backdrop-blur-lg py-2" : "bg-black/50 backdrop-blur-sm py-4",
        isRTL ? "rtl" : "ltr"
      )}
    >
      <MaxWidthWrapper noPadding className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/${safeLocale}`}
            className={cn("transition-transform hover:scale-105", isRTL ? "ml-4 md:ml-8" : "mr-4 md:mr-8")}
          >
            {logoUrl ? (
              <div className="relative h-8 w-24 md:h-10 md:w-32">
                <Image src={logoUrl} alt="Sparta Logo" fill className="object-contain" priority />
              </div>
            ) : (
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-[#8a70d6]">Sparta</span>
              </span>
            )}
          </Link>

          <div className="hidden md:block">
            <LangSwitcher locale={safeLocale} />
          </div>

          <ul className="hidden md:flex items-center gap-2 lg:gap-4 rtl:space-x-reverse">
            {navItems.map((item) => (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors px-2 py-1",
                    isActiveLink(item.href) ? "text-[#d359ff]" : "text-white hover:text-[#8a70d6]"
                  )}
                  prefetch={false}
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

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Get Started button */}
          <Link
            href={`/${safeLocale}/contact`}
            className=" inline-flex items-center lg:textbase text-nowrap justify-center rounded-full border border-white px-2 lg:px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            prefetch={false}
          >
            {t("contact")}
          </Link>
          <Link
            href={`/${safeLocale}/services`}
            className=" hidden lg:inline-flex items-center text-nowrap lg:text-base text-s justify-center rounded-full bg-white px-2 
            py-2 text-sm font-medium text-[#121628] transition-colors hover:bg-white/90"
            prefetch={false}
          >
            {t("getStarted")}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors z-50"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 top-0  h-full bg-[#121628] backdrop-blur-sm z-40"
          >
            <div className="flex flex-col items-center bg-[#121628] justify-center min-h-screen px-6">
              <motion.ul
                className={cn("flex flex-col items-center space-y-6 w-full", isRTL ? "rtl" : "ltr")}
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {navItems.map((item) => (
                  <motion.li key={item.name} variants={itemVariants} className="w-full">
                    <Link
                      href={item.href}
                      onClick={() => {
                        setIsMenuOpen(false);
                        document.body.style.overflow = "unset";
                      }}
                      className={cn(
                        "block text-center text-lg font-medium py-3 border-b border-white/10 w-full transition-colors",
                        isActiveLink(item.href) ? "text-[#d359ff] border-[#d359ff]" : "text-white hover:text-[#8a70d6]"
                      )}
                      prefetch={false}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
                <motion.li variants={itemVariants} className="w-full pt-6">
                  <Link
                    href={`/${safeLocale}/contact`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      document.body.style.overflow = "unset";
                    }}
                    className="block text-center rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 w-full"
                    prefetch={false}
                  >
                    {t("contact")}
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants} className="w-full pt-4 flex justify-center">
                  <LangSwitcher locale={safeLocale} />
                </motion.li>
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
