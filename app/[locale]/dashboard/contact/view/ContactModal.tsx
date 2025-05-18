"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface ContactData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  service_id: string;
  serviceName: string;
  createdAt: string;
}

interface ContactModalProps {
  contact: ContactData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ contact, isOpen, onClose }: ContactModalProps) => {
  if (!contact) return null;

  // Format date if available
  const formattedDate = contact.createdAt 
    ? format(new Date(contact.createdAt), "PPP 'at' p") 
    : "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact Details</DialogTitle>
          <DialogDescription>
            Submitted on {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Contact details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">First Name</p>
              <p className="font-medium">{contact.first_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Name</p>
              <p className="font-medium">{contact.last_name}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{contact.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="font-medium">{contact.phone_number}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Service</p>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              {contact.serviceName || "N/A"}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Message</p>
            <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
              {contact.message}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal; 