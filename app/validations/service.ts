import { z } from "zod";

// Description item schema
const descriptionItemSchema = z.object({
  title: z.string().min(1, "Description title is required"),
  description: z.string().min(1, "Description content is required"),
});

// Service schema
export const serviceSchema = z.object({
  _id: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  descriptions: z.array(descriptionItemSchema).min(1, "At least one description is required"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
export type DescriptionItem = z.infer<typeof descriptionItemSchema>;
