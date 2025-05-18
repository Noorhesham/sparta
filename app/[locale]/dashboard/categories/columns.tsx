"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CategoryModal from "./CategoryModal";
import { deleteCategory } from "./actions";
import { toast } from "sonner";

export type Category = {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  createdAt: string;
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name_en",
    header: "English Name",
  },
  {
    accessorKey: "name_ar",
    header: "Arabic Name",
    cell: ({ row }) => {
      return (
        <div dir="rtl" className="text-right">
          {row.getValue("name_ar")}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this category?")) {
          try {
            await deleteCategory(category.id);
            toast.success("Category deleted successfully");
          } catch (error) {
            toast.error("Failed to delete category");
          }
        }
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <CategoryModal mode="edit" category={category}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </CategoryModal>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
