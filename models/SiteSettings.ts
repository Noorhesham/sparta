import mongoose, { Schema, models } from "mongoose";

// Create the schema
const SiteSettingsSchema = new Schema(
  {
    logo: {
      type: String,
      required: [true, "Logo is required"],
    },
    whatsapp: {
      type: String,
      required: [true, "WhatsApp number is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const SiteSettings = models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
