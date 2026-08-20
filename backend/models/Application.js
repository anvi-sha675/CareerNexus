import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../constants/index.js";

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      required: true,
    },
    note: { type: String, default: "" },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
      index: true,
    },
    matchScore: { type: Number, default: 0, min: 0, max: 100 },
    matchBreakdown: {
      skillScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      projectScore: { type: Number, default: 0 },
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
    },
    recruiterNotes: { type: String, default: "", maxlength: 2000 },
    timeline: [timelineEntrySchema],
    withdrawnAt: { type: Date, default: null },
  },
  { timestamps: true },
);

applicationSchema.index({ job: 1, student: 1 }, { unique: true });
applicationSchema.index({ student: 1, createdAt: -1 });
applicationSchema.index({ job: 1, status: 1 });

export default mongoose.model("Application", applicationSchema);
