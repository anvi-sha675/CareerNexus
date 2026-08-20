import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    period: { type: String, default: "" },
    grade: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Education", educationSchema);
