import mongoose, { Schema, models } from "mongoose";

// Create the schema
const SubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const Subscriber = models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

export default Subscriber;
