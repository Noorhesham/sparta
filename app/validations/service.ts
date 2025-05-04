import { z } from "zod";

// Service schema
export const serviceSchema = z.object({
  _id: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
