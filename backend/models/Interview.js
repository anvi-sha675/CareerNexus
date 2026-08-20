import mongoose from "mongoose";
import { INTERVIEW_STATUS, INTERVIEW_MODE } from "../constants/index.js";

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    scheduledDate: { type: Date, required: true },
    time: { type: String, required: true },
    mode: { type: String, enum: INTERVIEW_MODE, default: "Video Call" },
    meetingLink: { type: String, default: "" },
    location: { type: String, default: "" },
    interviewerName: { type: String, required: true },
    notes: { type: String, default: "", maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(INTERVIEW_STATUS),
      default: INTERVIEW_STATUS.SCHEDULED,
      index: true,
    },
    rescheduleHistory: [
      {
        previousDate: Date,
        previousTime: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

interviewSchema.index({ recruiter: 1, scheduledDate: 1 });
interviewSchema.index({ student: 1, scheduledDate: 1 });

export default mongoose.model("Interview", interviewSchema);
