"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, Phone } from "lucide-react";
import Link from "next/link";
import TranslatedHeader from "@/app/components/TranslatedHeader";
import DeleteSingle from "@/app/components/DeleteSingle";
import { Checkbox } from "@/components/ui/checkbox";
import ViewButton from "./view/ViewButton";
import { Badge } from "@/components/ui/badge";

export interface ContactData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  service_ids: Array<{
    _id: string;
    title_en: string;
    title_ar: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const contactColumns: ColumnDef<ContactData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
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
    accessorKey: "first_name",
    header: () => <TranslatedHeader title="dashboard.contact.columns.first_name" />,
  },
  {
    accessorKey: "last_name",
    header: () => <TranslatedHeader title="dashboard.contact.columns.last_name" />,
  },
  {
    accessorKey: "email",
    header: () => <TranslatedHeader title="dashboard.contact.columns.email" />,
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-blue-500" />
          <span>{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: () => <TranslatedHeader title="dashboard.contact.columns.phone_number" />,
    cell: ({ row }) => {
      const phone = row.original.phone_number;
      return (
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-green-500" />
          <span>{phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "service_ids",
    header: () => <TranslatedHeader title="dashboard.contact.columns.service" />,
    cell: ({ row }) => {
      const services = row.original.service_ids || [];
      return (
        <div className="flex flex-wrap gap-1">
          {services.map((service) => (
            <Badge key={service._id} variant="outline" className="bg-purple-50 hover:bg-purple-100 transition-colors">
              <span className="flex flex-col text-xs">
                <span className="font-medium">{service.title_en}</span>
                <span className="text-gray-500 text-[10px] rtl:text-right">{service.title_ar}</span>
              </span>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <TranslatedHeader title="dashboard.common.createdAt" />,
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "view",
    header: () => <TranslatedHeader title="dashboard.common.view" />,
    cell: ({ row }) => <ViewButton contact={row.original} />,
  },
  {
    id: "actions",
    header: () => <TranslatedHeader title="dashboard.common.actions" />,
    cell: ({ row }) => {
      const contact = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteSingle data={contact} entity="ContactUs" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
