import mongoose, { Schema, models } from "mongoose";

// Delete the existing model if it exists to prevent schema conflicts
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

const CategorySchema = new Schema(
  {
    name_en: {
      type: String,
      required: [true, "English category name is required"],
      unique: true,
    },
    name_ar: {
      type: String,
      required: [true, "Arabic category name is required"],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      // Auto-generate slug from English name
      default: function (this: any) {
        if (!this.name_en) return "";
        return this.name_en
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      },
    },
  },
  {
    timestamps: true,
    strict: true, // This ensures only defined fields are saved
  }
);

// Pre-save middleware to update slug when name_en changes
CategorySchema.pre("save", function (next) {
  if (this.isModified("name_en")) {
    // Update slug
    this.slug = this.name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

const Category = models.Category || mongoose.model("Category", CategorySchema);

export default Category;
