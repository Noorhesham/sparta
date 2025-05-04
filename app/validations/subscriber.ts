import { z } from "zod";

// Subscriber schema
export const subscriberSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email("Invalid email address"),
});

export type SubscriberFormValues = z.infer<typeof subscriberSchema>; 