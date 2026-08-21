import { Notification } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";
import { emitToUser } from "../socket/index.js";

export const notificationService = {
  async list(userId, query) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { recipient: userId };
    if (query.read === "true") filter.read = true;
    if (query.read === "false") filter.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: userId, read: false }),
    ]);
    return {
      notifications,
      unreadCount,
      meta: buildMeta({ page, limit, total }),
    };
  },

  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true, readAt: new Date() },
      { new: true },
    );
    if (!notification) throw ApiError.notFound("Notification not found");
    return notification;
  },

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true, readAt: new Date() },
    );
    return { success: true };
  },

  async remove(userId, notificationId) {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });
    if (!notification) throw ApiError.notFound("Notification not found");
    return { deleted: true };
  },

  async create(payload) {
    const notification = await Notification.create(payload);
    try {
      emitToUser(payload.recipient, "notification:new", notification);
    } catch {
    }
    return notification;
  },
};
