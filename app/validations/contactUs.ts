import { z } from "zod";

// Contact Us schema
export const contactUsSchema = z.object({
  _id: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  service_id: z.string().min(1, "Service is required"),
});

export type ContactUsFormValues = z.infer<typeof contactUsSchema>;
