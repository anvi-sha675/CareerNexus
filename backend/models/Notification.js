import mongoose from "mongoose";
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_CATEGORY,
} from "../constants/index.js";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      default: NOTIFICATION_TYPE.INFO,
    },
    category: {
      type: String,
      enum: Object.values(NOTIFICATION_CATEGORY),
      default: NOTIFICATION_CATEGORY.SYSTEM,
    },
    relatedEntity: {
      entityType: { type: String, default: null },
      entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
