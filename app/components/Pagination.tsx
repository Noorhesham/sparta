"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationDemoProps {
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function PaginationDemo({
  totalPages = 5,
  currentPage: externalCurrentPage,
  onPageChange,
}: PaginationDemoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(externalCurrentPage || 1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only use searchParams for current page if no external current page is provided
    if (externalCurrentPage === undefined) {
      const page = parseInt(searchParams.get("page") || "1", 10);
      setCurrentPage(page);
    } else {
      setCurrentPage(externalCurrentPage);
    }
  }, [searchParams, externalCurrentPage]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const handlePageChange = (page: number) => {
    setIsLoading(true);

    if (onPageChange) {
      // Use client-side pagination via callback
      onPageChange(page);
    } else {
      // Use standard navigation for server-side pagination
      const newUrl = `${pathname}?${createQueryString("page", page.toString())}`;
      router.push(newUrl);
    }

    // Set a short timeout to show loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Don't render pagination if only 1 page
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6">
      <PaginationContent className="flex flex-wrap justify-center">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            className={`${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
            onClick={() => {
              if (currentPage > 1 && !isLoading) {
                handlePageChange(currentPage - 1);
              }
            }}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;

          // Show first, last, and pages around current page
          const showPage =
            totalPages <= 7 || // Show all if 7 or fewer pages
            page === 1 || // Always show first page
            page === totalPages || // Always show last page
            Math.abs(currentPage - page) <= 1; // Show pages around current

          // Show ellipsis for first gap
          const showFirstEllipsis = page === 2 && currentPage > 3;

          // Show ellipsis for last gap
          const showLastEllipsis = page === totalPages - 1 && currentPage < totalPages - 2;

          return (
            <React.Fragment key={page}>
              {showFirstEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {showPage && (
                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLoading) handlePageChange(page);
                    }}
                    href="#"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )}

              {showLastEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </React.Fragment>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            className={`${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
            onClick={() => {
              if (currentPage < totalPages && !isLoading) {
                handlePageChange(currentPage + 1);
              }
            }}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
