import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    date: { type: String, default: "" },
    credentialUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Certification", certificationSchema);
