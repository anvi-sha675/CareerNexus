import { messageService } from "../services/messageService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getIO } from "../socket/index.js";

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await messageService.listConversations(req.user._id);
  sendSuccess(res, { data: conversations });
});

export const startConversation = asyncHandler(async (req, res) => {
  const conversation = await messageService.getOrCreateConversation(
    req.user._id,
    req.body.userId,
    req.body.jobId,
  );
  sendSuccess(res, { statusCode: 201, data: conversation });
});

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await messageService.listMessages(
    req.user._id,
    req.params.conversationId,
  );
  sendSuccess(res, { data: messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await messageService.sendMessage(
    req.user._id,
    req.params.conversationId,
    req.body,
  );
  try {
    getIO()
      .to(`conversation:${req.params.conversationId}`)
      .emit("message:new", message);
  } catch {
  }
  sendSuccess(res, { statusCode: 201, data: message });
});

export const uploadAttachment = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const attachment = {
    fileName: req.file.originalname,
    fileUrl: `/uploads/attachments/${req.file.filename}`,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
  };
  sendSuccess(res, {
    statusCode: 201,
    message: "Attachment uploaded",
    data: attachment,
  });
});
