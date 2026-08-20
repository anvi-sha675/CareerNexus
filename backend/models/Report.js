import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["daily", "weekly", "monthly", "custom"],
      required: true,
    },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      newUsers: { type: Number, default: 0 },
      newStudents: { type: Number, default: 0 },
      newRecruiters: { type: Number, default: 0 },
      newJobs: { type: Number, default: 0 },
      newApplications: { type: Number, default: 0 },
      interviewsScheduled: { type: Number, default: 0 },
      hires: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

reportSchema.index({ createdAt: -1 });

export default mongoose.model("Report", reportSchema);
