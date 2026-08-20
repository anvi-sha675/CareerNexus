import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    stack: { type: String, default: "" },
    link: { type: String, default: "" },
    description: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
