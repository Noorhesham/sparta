"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, AppWindow, SmartphoneIcon, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TranslatedHeader from "@/app/components/TranslatedHeader";
import DeleteSingle from "@/app/components/DeleteSingle";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "next-intl";
import TranslatedText from "@/app/components/TranslatedText";

export interface CategoryData {
  _id: string;
  name_en: string;
  name_ar: string;
}

export interface ProductData {
  _id: string;
  cover: string;
  project_name: string;
  description: string;
  google_link?: string;
  app_store_link?: string;
  website_link?: string;
  project_images: string[];
  createdAt: string;
  updatedAt: string;
  category: string | CategoryData;
}

export const productColumns: ColumnDef<ProductData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "cover",
    header: () => <TranslatedHeader title="dashboard.products.columns.cover" />,
    cell: ({ row }) => {
      const cover = row.original.cover;
      return (
        <div className="w-20 h-20 relative">
          <Image src={cover || "/"} alt="Cover" fill className="object-cover rounded" />
        </div>
      );
    },
  },
  {
    accessorKey: "project_name",
    header: () => <TranslatedHeader title="dashboard.products.columns.project_name" />,
  },
  {
    accessorKey: "description",
    header: () => <TranslatedHeader title="dashboard.products.columns.description" />,
    cell: ({ row }) => {
      const description = row.original.description;
      return description.length > 100 ? `${description.substring(0, 100)}...` : description;
    },
  },

  // {
  //   id: "links",
  //   header: () => <TranslatedHeader title="dashboard.products.columns.links" />,
  //   cell: ({ row }) => {
  //     const product = row.original;
  //     return (
  //       <div className="flex space-x-2">
  //         {product.google_link && (
  //           <a href={product.google_link} target="_blank" rel="noopener noreferrer">
  //             <Store className="h-5 w-5 text-green-600" />
  //           </a>
  //         )}
  //         {product.app_store_link && (
  //           <a href={product.app_store_link} target="_blank" rel="noopener noreferrer">
  //             <SmartphoneIcon className="h-5 w-5 text-blue-600" />
  //           </a>
  //         )}
  //         {product.website_link && (
  //           <a href={product.website_link} target="_blank" rel="noopener noreferrer">
  //             <AppWindow className="h-5 w-5 text-purple-600" />
  //           </a>
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    id: "images",
    header: () => <TranslatedHeader title="dashboard.products.columns.images" />,
    cell: ({ row }) => {
      const images = row.original.project_images;
      return <Badge variant="outline">{images?.length}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <TranslatedHeader title="dashboard.common.createdAt" />,
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: () => <TranslatedHeader title="dashboard.common.actions" />,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/products/edit/${product._id}`}>
                <TranslatedHeader title="dashboard.common.edit" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteSingle data={product} entity="Product" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
