import mongoose from "mongoose";
import { COMPANY_VERIFICATION_STATUS } from "../constants/index.js";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    industry: { type: String, default: "" },
    size: { type: String, default: "" },
    website: { type: String, default: "" },
    location: { type: String, default: "" },
    about: { type: String, default: "", maxlength: 3000 },
    logo: { type: String, default: null },
    coverImage: { type: String, default: null },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    benefits: [{ type: String, trim: true }],
    gallery: [{ type: String }],
    verificationStatus: {
      type: String,
      enum: Object.values(COMPANY_VERIFICATION_STATUS),
      default: COMPANY_VERIFICATION_STATUS.PENDING,
      index: true,
    },
    verificationDocuments: [
      {
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    verifiedAt: { type: Date, default: null },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

companySchema.index({ name: "text", industry: "text" });

export default mongoose.model("Company", companySchema);
