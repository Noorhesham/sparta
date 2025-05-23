import mongoose, { Schema, models } from "mongoose";

// Create the schema
const ContactUsSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"],
    },
    service_ids: {
      type: [String], // Changed to array of strings
      required: [true, "At least one service is required"],
      ref: "Service",
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const ContactUs = models.ContactUs || mongoose.model("ContactUs", ContactUsSchema);

export default ContactUs;
