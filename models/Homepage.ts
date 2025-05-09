import mongoose, { Schema, models } from "mongoose";

// Multi-language text schema
const LanguageTextSchema = new Schema(
  {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  { _id: false }
);

// Hero section schema
const HeroSchema = new Schema(
  {
    title: { type: LanguageTextSchema, required: true },
    subtitle: { type: LanguageTextSchema, required: true },
    description: { type: LanguageTextSchema, required: true },
    backgroundImage: { type: String, required: true },
    buttonText: { type: LanguageTextSchema, required: true },
    buttonLink: { type: String, required: true },
  },
  { _id: false }
);

// About section schema
const AboutSchema = new Schema(
  {
    title: { type: LanguageTextSchema, required: true },
    miniTitle: { type: LanguageTextSchema, required: true },
    description: { type: LanguageTextSchema, required: true },
    link: { type: String, required: true },
    linkText: { type: LanguageTextSchema, required: true },
    mainImage: { type: String, required: true },
  },
  { _id: false }
);

// Service schema for about section
const AboutServiceSchema = new Schema(
  {
    title: { type: LanguageTextSchema, required: true },
    miniTitle: { type: LanguageTextSchema, required: true },
    description: { type: LanguageTextSchema, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

// Logo schema
const LogoSchema = new Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

// Service schema
const ServiceSchema = new Schema(
  {
    title: { type: LanguageTextSchema, required: true },
    description: { type: LanguageTextSchema, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true, default: "#3B82F6" },
    link: { type: String, required: true },
    linkText: { type: LanguageTextSchema, required: true },
  },
  { _id: false }
);

// Technology schema
const TechnologySchema = new Schema(
  {
    name: { type: String, required: true },
    images: { type: [String], required: true },
  },
  { _id: false }
);

// Technology section schema
const TechnologiesSectionSchema = new Schema(
  {
    title: { type: LanguageTextSchema, required: true },
    description: { type: LanguageTextSchema, required: true },
    technologies: { type: [TechnologySchema], required: true },
  },
  { _id: false }
);

// Homepage schema
const HomepageSchema = new Schema(
  {
    hero: { type: HeroSchema, required: true },
    about: { type: AboutSchema, required: true },
    aboutServices: { type: [AboutServiceSchema], required: true },
    logos: { type: [LogoSchema], required: true },
    services: { type: [ServiceSchema], required: true },
    technologies: { type: [TechnologySchema], required: true },
  },
  { timestamps: true }
);

export default models.Homepage || mongoose.model("Homepage", HomepageSchema);
