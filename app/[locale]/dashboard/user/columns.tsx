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
import TranslatedHeader from "@/app/components/TranslatedHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import DeleteSingle from "@/app/components/DeleteSingle";
import UserForm from "./components/UserForm";
import ModelCustom from "@/app/components/ModelCustom";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "user" | "admin";
  avatar?: {
    secure_url: string;
    public_id: string;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export const userColumns: ColumnDef<UserData>[] = [
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
  //   {
  //     id: "avatar",
  //     header: () => <TranslatedHeader title="dashboard.users.columns.avatar" />,
  //     cell: ({ row }) => {
  //       const avatar = row.original.avatar?.secure_url;
  //       return avatar ? (
  //         <div className="w-10 h-10 relative">
  //           <Image src={avatar} alt="Avatar" fill className="object-cover rounded-full" />
  //         </div>
  //       ) : (
  //         <div className="w-10 h-10 bg-gray-200 rounded-full" />
  //       );
  //     },
  //   },
  {
    accessorKey: "name",
    header: () => <TranslatedHeader title="dashboard.users.columns.name" />,
  },
  {
    accessorKey: "email",
    header: () => <TranslatedHeader title="dashboard.users.columns.email" />,
  },
  {
    accessorKey: "phone",
    header: () => <TranslatedHeader title="dashboard.users.columns.phone" />,
  },
  {
    accessorKey: "role",
    header: () => <TranslatedHeader title="dashboard.users.columns.role" />,
    cell: ({ row }) => (
      <Badge variant={row.original.role === "admin" ? "destructive" : "default"}>{row.original.role}</Badge>
    ),
  },
  {
    accessorKey: "isVerified",
    header: () => <TranslatedHeader title="dashboard.users.columns.verified" />,
    cell: ({ row }) => (
      <Badge variant={row.original.isVerified ? "default" : "secondary"}>
        {row.original.isVerified ? "Verified" : "Unverified"}
      </Badge>
    ),
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
      const user = row.original;

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
              <ModelCustom title="Edit User" btn={<Button>Edit</Button>} content={<UserForm initialData={user} />} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteSingle data={user} entity="User" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
