import { z } from "zod";

// Team Member schema
export const teamMemberSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  job_title: z.string().min(1, "Job title is required"),
  image: z.string().min(1, "Image is required"),
  Facebook_link: z.string().optional(),
  instagram_link: z.string().optional(),
  x_link: z.string().optional(),
  linkedin: z.string().optional(),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;
