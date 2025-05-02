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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sections: {
      type: [Schema.Types.Mixed],
      validate: {
        validator: function (sections: any[]) {
          return sections.every(
            (section) =>
              (section.type === "text" && section.content && section.order) ||
              (section.type === "image" && section.imageUrl && section.order)
          );
        },
        message: "All sections must have valid type and required fields",
      },
    },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

// Export models
export const Category = models.Category || mongoose.model("Category", CategorySchema);
export const Blog = models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
