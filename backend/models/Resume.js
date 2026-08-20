import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSizeBytes: { type: Number, default: 0 },
    mimeType: { type: String, default: "application/pdf" },
    rawText: { type: String, default: "", select: false },
    parsed: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      skills: [{ type: String }],
      education: [{ type: String }],
      experience: [{ type: String }],
      projects: [{ type: String }],
    },
    atsScore: { type: Number, default: 0, min: 0, max: 100 },
    atsChecks: [
      {
        label: String,
        pass: Boolean,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

resumeSchema.index({ student: 1, createdAt: -1 });

export default mongoose.model("Resume", resumeSchema);
