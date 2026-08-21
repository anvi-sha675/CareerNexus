import { notificationService } from "../services/notificationService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const { notifications, unreadCount, meta } = await notificationService.list(
    req.user._id,
    req.query,
  );
  sendSuccess(res, { data: notifications, meta: { ...meta, unreadCount } });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.user._id,
    req.params.id,
  );
  sendSuccess(res, { message: "Marked as read", data: notification });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  sendSuccess(res, { message: "All notifications marked as read" });
});

export const removeNotification = asyncHandler(async (req, res) => {
  await notificationService.remove(req.user._id, req.params.id);
  sendSuccess(res, { message: "Notification deleted" });
});
