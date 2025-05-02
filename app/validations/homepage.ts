import { z } from "zod";

// Language text schema
const languageTextSchema = z.object({
  en: z.string().min(1, "English text is required"),
  ar: z.string().min(1, "Arabic text is required"),
});

// Hero section schema
const heroSchema = z.object({
  title: languageTextSchema,
  subtitle: languageTextSchema,
  description: languageTextSchema,
  backgroundImage: z.string().min(1, "Background image URL is required"),
  buttonText: languageTextSchema,
  buttonLink: z.string().min(1, "Button link is required"),
});

// About section schema
const aboutSchema = z.object({
  title: languageTextSchema,
  miniTitle: languageTextSchema,
  description: languageTextSchema,
  link: z.string().min(1, "Link is required"),
  linkText: languageTextSchema,
  mainImage: z.string().min(1, "Main image URL is required"),
});

// Service schema for about section
const aboutServiceSchema = z.object({
  title: languageTextSchema,
  miniTitle: languageTextSchema,
  description: languageTextSchema,
  image: z.string().min(1, "Image URL is required"),
});

// Logo schema
const logoSchema = z.object({
  image: z.string().min(1, "Logo image URL is required"),
  name: z.string().min(1, "Logo name is required"),
});

// Service schema
const serviceSchema = z.object({
  title: languageTextSchema,
  description: languageTextSchema,
  icon: z.string().min(1, "Icon URL is required"),
  color: z.string().min(1, "Color is required"),
  link: z.string().min(1, "Link is required"),
  linkText: languageTextSchema,
});

// Technology schema
const technologySchema = z.object({
  name: z.string().min(1, "Technology name is required"),
  images: z.array(z.string().min(1, "Technology image URL is required")),
});

// Technology section schema
const technologiesSectionSchema = z.object({
  technologies: z.array(technologySchema),
});

// Homepage schema
export const homepageSchema = z.object({
  _id: z.string().optional(),
  hero: heroSchema,
  about: aboutSchema,
  aboutServices: z.array(aboutServiceSchema),
  logos: z.array(logoSchema),
  services: z.array(serviceSchema),
  technologiesSection: technologiesSectionSchema,
});

export type HomepageFormValues = z.infer<typeof homepageSchema>;
