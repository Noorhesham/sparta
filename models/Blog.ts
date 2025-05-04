import mongoose, { Schema, models } from "mongoose";

// Multi-language text schema
const LanguageTextSchema = new Schema(
  {
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  { _id: false }
);

// Section schemas - for dynamic content
const TextSectionSchema = new Schema(
  {
    type: { type: String, default: "text", enum: ["text"] },
    content: { type: LanguageTextSchema, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const ImageSectionSchema = new Schema(
  {
    type: { type: String, default: "image", enum: ["image"] },
    imageUrl: { type: String, required: true },
    caption: { type: LanguageTextSchema },
    order: { type: Number, required: true },
  },
  { _id: false }
);

// Blog category schema
const CategorySchema = new Schema(
  {
    name: { type: LanguageTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Blog schema
const BlogSchema = new Schema(
  {
    title: { type: LanguageTextSchema, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: LanguageTextSchema, required: true },
    author: { type: String, required: true },
    mainImage: { type: String, required: true },
    thumbnailImage: { type: String, required: true },
    sections: {
      type: [Schema.Types.Mixed],
      validate: {
        validator: function (sections: any[]) {
          if (!sections || !Array.isArray(sections) || sections.length === 0) {
            return false;
          }

          return sections.every((section) => {
            if (!section || typeof section !== "object") return false;

            // Validate text section
            if (section.type === "text") {
              return section.content && section.content.en && section.content.ar && typeof section.order === "number";
            }
            // Validate image section
            else if (section.type === "image") {
              return section.imageUrl && typeof section.imageUrl === "string" && typeof section.order === "number";
            }

            return false;
          });
        },
        message: "All sections must have valid type and required fields",
      },
      required: [true, "At least one section is required"],
    },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Export models
export const Category = models.Category || mongoose.model("Category", CategorySchema);
export const Blog = models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
