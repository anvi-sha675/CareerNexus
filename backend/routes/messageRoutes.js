import { Router } from "express";
import * as messageController from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import { uploadAttachment } from "../middleware/upload.js";

const router = Router();
router.use(protect);

router.get("/conversations", messageController.listConversations);
router.post("/conversations", messageController.startConversation);
router.get(
  "/conversations/:conversationId/messages",
  messageController.listMessages,
);
router.post(
  "/conversations/:conversationId/messages",
  messageController.sendMessage,
);
router.post(
  "/attachments",
  uploadAttachment.single("file"),
  messageController.uploadAttachment,
);

export default router;
