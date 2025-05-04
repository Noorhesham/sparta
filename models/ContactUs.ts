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
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const ContactUs = models.ContactUs || mongoose.model("ContactUs", ContactUsSchema);

export default ContactUs;
