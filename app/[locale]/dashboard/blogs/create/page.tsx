import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import React from "react";
import { BlogForm } from "../components/BlogForm";

const page = () => {
  return (
    <MaxWidthWrapper>
      <BlogForm />
    </MaxWidthWrapper>
  );
};

export default page;
