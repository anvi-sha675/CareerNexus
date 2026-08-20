import mongoose from "mongoose";
import { SKILL_LEVELS } from "../constants/index.js";

const skillSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    level: { type: String, enum: SKILL_LEVELS, default: "Intermediate" },
  },
  { timestamps: true },
);

skillSchema.index({ student: 1, name: 1 }, { unique: true });

export default mongoose.model("Skill", skillSchema);
