import mongoose from "mongoose";
import { AUDIT_ACTION } from "../constants/index.js";

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: String, enum: Object.values(AUDIT_ACTION), required: true },
    description: { type: String, required: true },
    targetType: { type: String, default: null },
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true },
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
