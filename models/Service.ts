import mongoose, { Schema, models } from "mongoose";

// Description schema
const DescriptionSchema = new Schema({
  title: {
    type: String,
    required: [true, "Description title is required"],
  },
  description: {
    type: String,
    required: [true, "Description content is required"],
  },
});

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

// Export the model
const Service = models.Service || mongoose.model("Service", ServiceSchema);

export default Service;
