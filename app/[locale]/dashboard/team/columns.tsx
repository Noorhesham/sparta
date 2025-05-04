"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TranslatedHeader from "@/app/components/TranslatedHeader";
import DeleteSingle from "@/app/components/DeleteSingle";
import { Checkbox } from "@/components/ui/checkbox";

export interface TeamMemberData {
  _id: string;
  name: string;
  job_title: string;
  image: string;
  Facebook_link?: string;
  instagram_link?: string;
  x_link?: string;
  linkedin?: string;
  createdAt: string;
  updatedAt: string;
}

export const teamMemberColumns: ColumnDef<TeamMemberData>[] = [
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
    id: "image",
    header: () => <TranslatedHeader title="dashboard.team.columns.image" />,
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <div className="w-16 h-16 relative">
          <Image src={image || "/"} alt="Profile" fill className="object-cover rounded-full" />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <TranslatedHeader title="dashboard.team.columns.name" />,
  },
  {
    accessorKey: "job_title",
    header: () => <TranslatedHeader title="dashboard.team.columns.job_title" />,
  },
  {
    id: "socials",
    header: () => <TranslatedHeader title="dashboard.team.columns.socials" />,
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex space-x-2">
          {member.Facebook_link && (
            <a href={member.Facebook_link} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5 text-blue-600" />
            </a>
          )}
          {member.instagram_link && (
            <a href={member.instagram_link} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5 text-pink-600" />
            </a>
          )}
          {member.x_link && (
            <a href={member.x_link} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5 text-blue-400" />
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5 text-blue-800" />
            </a>
          )}
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
    id: "actions",
    header: () => <TranslatedHeader title="dashboard.common.actions" />,
    cell: ({ row }) => {
      const member = row.original;

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
              <Link href={`/dashboard/team/edit/${member._id}`}>
                <TranslatedHeader title="dashboard.common.edit" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteSingle data={member} entity="TeamMember" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
