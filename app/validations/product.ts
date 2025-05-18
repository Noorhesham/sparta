import { z } from "zod";

// Product schema
export const productSchema = z.object({
  _id: z.string().optional(),
  cover: z.string().min(1, "Cover image is required"),
  project_name: z.string().min(1, "Project name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  google_link: z.string().optional(),
  app_store_link: z.string().optional(),
  website_link: z.string().optional(),
  project_images: z.array(z.string()).optional().default([]),
  category: z.string().min(1, "Category is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
