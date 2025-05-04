import mongoose, { Schema, models } from "mongoose";

// Create the schema
const TeamMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    job_title: {
      type: String,
      required: [true, "Job title is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    Facebook_link: {
      type: String,
      default: "",
    },
    instagram_link: {
      type: String,
      default: "",
    },
    x_link: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const TeamMember = models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);

export default TeamMember;
