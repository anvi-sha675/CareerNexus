import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    period: { type: String, default: "" },
    description: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true },
);

export default mongoose.model("Experience", experienceSchema);
