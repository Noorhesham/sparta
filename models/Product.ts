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

// Export the model
const Product = models.Product || mongoose.model("Product", ProductSchema);

export default Product;
