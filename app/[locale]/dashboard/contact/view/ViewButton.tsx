"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import ContactModal from "./ContactModal";

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

interface ViewButtonProps {
  contact: ContactData;
}

const ViewButton: React.FC<ViewButtonProps> = ({ contact }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      >
        <Eye size={16} />
        <span>View</span>
      </Button>

      <ContactModal contact={contact} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ViewButton;
