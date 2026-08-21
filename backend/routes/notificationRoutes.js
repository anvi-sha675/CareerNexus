import { Router } from "express";
import * as notificationController from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", notificationController.listNotifications);
router.patch("/read-all", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.removeNotification);

export default router;
