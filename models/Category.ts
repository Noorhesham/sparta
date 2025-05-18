import mongoose, { Schema, models } from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || mongoose.model("Category", CategorySchema);

export default Category;
