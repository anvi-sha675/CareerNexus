import { Conversation, Message } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";

export const messageService = {
  async listConversations(userId) {
    return Conversation.find({ participants: userId })
      .populate("participants", "name email avatar role")
      .sort({ lastMessageAt: -1 });
  },

  async getOrCreateConversation(userId, otherUserId, relatedJob = null) {
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId], $size: 2 },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherUserId],
        relatedJob,
      });
    }
    return conversation;
  },

  async listMessages(userId, conversationId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });
    if (!conversation) throw ApiError.notFound("Conversation not found");
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar");
    return messages;
  },

  async sendMessage(userId, conversationId, { text, attachments = [] }) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });
    if (!conversation) throw ApiError.notFound("Conversation not found");

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      text,
      attachments,
      readBy: [userId],
    });
    conversation.lastMessage = text;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    return message;
  },
};
