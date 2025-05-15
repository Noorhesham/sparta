"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "./defaults/MaxWidthWrapper";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Don't render navbar on dashboard page
  if (pathname?.includes("/dashboard")) {
    return null;
  }

  return (
    <nav className="w-full py-4">
      <MaxWidthWrapper noPadding className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-12">
            <span className="text-2xl font-bold">
              <span className="text-[#8a70d6]">Sparta</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#8a70d6]",
                    index === 0 ? "text-[#d359ff] border-b-2 border-[#d359ff] pb-1" : "text-white"
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-full border border-white px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Contact Us
          </Link>
          <Link
            href="/get-started"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-medium text-[#121628] transition-colors hover:bg-white/90"
          >
            Get Started Now
          </Link>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
