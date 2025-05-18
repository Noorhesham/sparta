import mongoose, { Schema, models } from "mongoose";

// Description schema
const DescriptionSchema = new Schema({
  title_en: {
    type: String,
    required: [true, "English description title is required"],
  },
  title_ar: {
    type: String,
    required: [true, "Arabic description title is required"],
  },
  description_en: {
    type: String,
    required: [true, "English description content is required"],
  },
  description_ar: {
    type: String,
    required: [true, "Arabic description content is required"],
  },
});

// Create the schema
const ServiceSchema = new Schema(
  {
    icon: {
      type: String,
      required: [true, "Icon is required"],
    },
    title_en: {
      type: String,
      required: [true, "English title is required"],
    },
    title_ar: {
      type: String,
      required: [true, "Arabic title is required"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    descriptions: {
      type: [DescriptionSchema],
      required: [true, "At least one description is required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "Service must have at least one description",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug from title_en
ServiceSchema.pre("save", function (next) {
  if (!this.slug && this.title_en) {
    this.slug = this.title_en
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

// Export the model
const Service = models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
