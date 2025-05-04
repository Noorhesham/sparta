import mongoose, { Schema, models } from "mongoose";

// Create the schema
const ServiceSchema = new Schema(
  {
    icon: {
      type: String,
      required: [true, "Icon is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const Service = models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
