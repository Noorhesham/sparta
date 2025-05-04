import mongoose, { Schema, models } from "mongoose";

// Create the schema
const ProductSchema = new Schema(
  {
    cover: {
      type: String,
      required: [true, "Cover image is required"],
    },
    project_name: {
      type: String,
      required: [true, "Project name is required"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // This allows multiple documents with null/undefined values
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    google_link: {
      type: String,
      default: "",
    },
    app_store_link: {
      type: String,
      default: "",
    },
    website_link: {
      type: String,
      default: "",
    },
    project_images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug if not provided
ProductSchema.pre("save", function (next) {
  // Only generate slug if it's not set and project_name exists
  if (!this.slug && this.project_name) {
    // Convert project name to slug format (lowercase, replace spaces with hyphens)
    this.slug = this.project_name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  }
  next();
});

// Export the model
const Product = models.Product || mongoose.model("Product", ProductSchema);

export default Product;
