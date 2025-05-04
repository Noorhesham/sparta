"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import TranslatedHeader from "@/app/components/TranslatedHeader";
import DeleteSingle from "@/app/components/DeleteSingle";
import { Checkbox } from "@/components/ui/checkbox";
import ModelCustom from "@/app/components/ModelCustom";
import { BlogForm } from "./components/BlogForm";

export interface BlogData {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  thumbnailImage: string;
  slug: string;
  sections: {
    type: string;
    order: number;
    content?: unknown;
    imageUrl?: string;
    caption?: unknown;
  }[];
  category: {
    name: {
      en: string;
      ar: string;
    };
    _id: string;
  };
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export const blogColumns: ColumnDef<BlogData>[] = [
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
    id: "thumbnail",
    header: () => <TranslatedHeader title="dashboard.blogs.columns.thumbnail" />,
    cell: ({ row }) => {
      const thumbnailImage = row.original.thumbnailImage;
      return (
        <div className="w-20 h-20 relative">
          <Image src={thumbnailImage || "/"} alt="Thumbnail" fill className="object-cover rounded" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <TranslatedHeader title="dashboard.blogs.columns.title" />,
    cell: ({ row }) => {
      const title = row.original.title;
      return `${title.en} / ${title.ar}`;
    },
  },
  {
    accessorKey: "slug",
    header: () => <TranslatedHeader title="dashboard.blogs.columns.slug" />,
  },
  {
    accessorKey: "sections",
    header: () => <TranslatedHeader title="dashboard.blogs.columns.sections" />,
    cell: ({ row }) => {
      const sections = row.original.sections;
      return sections.length;
    },
  },
  {
    accessorKey: "published",
    header: () => <TranslatedHeader title="dashboard.blogs.columns.status" />,
    cell: ({ row }) => {
      return row.original.published ? (
        <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-600">
          <TranslatedHeader title="dashboard.blogs.status.published" />
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 border-yellow-600">
          <TranslatedHeader title="dashboard.blogs.status.draft" />
        </Badge>
      );
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
      const blog = row.original;

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
              <Link href={`/dashboard/blogs/preview/${blog._id}`}>
                <TranslatedHeader title="dashboard.common.view" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ModelCustom
                btn={
                  <Button variant="ghost" className=" w-full text-left">
                    <TranslatedHeader title="dashboard.common.edit" />
                  </Button>
                }
                content={<BlogForm initialData={blog} />}
              />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteSingle data={blog} entity="Blog" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
