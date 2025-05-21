import { z } from "zod";

// Language text schema
const languageTextSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

// Text section schema
const textSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("text"),
  content: languageTextSchema,
  order: z.number().int().nonnegative(),
});

// Image section schema
const imageSectionSchema = z.object({
  id: z.string().optional(),
  type: z.literal("image"),
  imageUrl: z.string().min(1, "Image URL is required"),
  caption: languageTextSchema.optional(),
  order: z.number().int().nonnegative(),
});

// Section Union schema
const sectionSchema = z.discriminatedUnion("type", [textSectionSchema, imageSectionSchema]);

// Blog schema
export const blogSchema = z.object({
  _id: z.string().optional(),
  title: languageTextSchema,
  slug: z.string().min(1, "Slug is required"),
  description: languageTextSchema,
  author: z.string().min(1, "Author is required"),
  mainImage: z.string().min(1, "Main image is required"),
  thumbnailImage: z.string().min(1, "Thumbnail image is required"),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// Category schema
export const categorySchema = z.object({
  _id: z.string().optional(),
  name: languageTextSchema,
  slug: z.string().min(1, "Slug is required"),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type SectionType = z.infer<typeof sectionSchema>;
export type TextSectionType = z.infer<typeof textSectionSchema>;
export type ImageSectionType = z.infer<typeof imageSectionSchema>;
