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
import TranslatedHeader from "@/app/components/TranslatedHeader";
import DeleteSingle from "@/app/components/DeleteSingle";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export interface ServiceData {
  _id: string;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const serviceColumns: ColumnDef<ServiceData>[] = [
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
    accessorKey: "icon",
    header: () => <TranslatedHeader title="dashboard.services.columns.icon" />,
    cell: ({ row }) => {
      const icon = row.original.icon;
      return (
        <div className=" w-20 h-20 relative">
          <Image src={icon} alt="Placeholder" fill className="object-cover rounded-md" />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <TranslatedHeader title="dashboard.services.columns.title" />,
  },
  {
    accessorKey: "description",
    header: () => <TranslatedHeader title="dashboard.services.columns.description" />,
    cell: ({ row }) => {
      const description = row.original.description;
      return description.length > 100 ? `${description.substring(0, 100)}...` : description;
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
      const service = row.original;

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
              <Link href={`/dashboard/services/edit/${service._id}`}>
                <TranslatedHeader title="dashboard.common.edit" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteSingle data={service} entity="Service" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
