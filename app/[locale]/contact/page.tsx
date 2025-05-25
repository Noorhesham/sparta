import ContactForm from "@/app/components/home/ContactForm";
import React from "react";

const page = ({ searchParams }: { searchParams: { email: string } }) => {
  const email = searchParams.email;
  return (
    <div>
      <ContactForm email={email} />
    </div>
  );
};

export default page;
