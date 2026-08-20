import mongoose from "mongoose";
import {
  JOB_STATUS,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
} from "../constants/index.js";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: { type: String, default: "" },
    location: { type: String, required: true },
    type: { type: String, enum: JOB_TYPES, default: "Full-time" },
    experience: {
      type: String,
      enum: EXPERIENCE_LEVELS,
      default: "Entry Level",
    },
    remote: { type: Boolean, default: false },
    salaryMin: { type: Number, required: true, min: 0 },
    salaryMax: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 8000 },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    tags: [{ type: String, trim: true, index: true }],
    applicationDeadline: { type: Date, default: null },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.ACTIVE,
      index: true,
    },
    isDraft: { type: Boolean, default: false },
    flaggedReason: { type: String, default: null },
    views: { type: Number, default: 0 },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

jobSchema.index({ title: "text", description: "text", tags: "text" });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ company: 1, status: 1 });

jobSchema.virtual("salaryRange").get(function salaryRange() {
  return `${this.salaryMin}-${this.salaryMax}`;
});

jobSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Job", jobSchema);
