import mongoose from "mongoose";
import { RECRUITER_STATUS } from "../constants/index.js";

const recruiterProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    designation: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(RECRUITER_STATUS),
      default: RECRUITER_STATUS.PENDING,
      index: true,
    },
    verificationNotes: { type: String, default: "" },
    approvedAt: { type: Date, default: null },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RecruiterProfile", recruiterProfileSchema);
