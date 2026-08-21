import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/tokens.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

let io = null;
const onlineUsers = new Map(); // userId -> Set of socket ids
const lastDisconnectedAt = new Map(); // userId -> Date, used for reconnect sync

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", async (socket) => {
    const { userId } = socket;
    const wasOffline = !onlineUsers.has(userId);
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    io.emit("presence:update", { userId, online: true });
    logger.info(`Socket connected: user ${userId} (${socket.id})`);

    if (wasOffline) {
      const since = lastDisconnectedAt.get(userId);
      if (since) {
        try {
          const { Notification } = await import("../models/index.js");
          const missed = await Notification.find({
            recipient: userId,
            read: false,
            createdAt: { $gt: since },
          })
            .sort({ createdAt: -1 })
            .limit(50);
          if (missed.length) socket.emit("sync:missed-notifications", missed);
        } catch (err) {
          logger.warn(
            `Reconnect sync failed for user ${userId}: ${err.message}`,
          );
        }
      }
      lastDisconnectedAt.delete(userId);
    }

    socket.on("conversation:join", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("typing:start", ({ conversationId }) => {
      socket
        .to(`conversation:${conversationId}`)
        .emit("typing:start", { userId, conversationId });
    });

    socket.on("typing:stop", ({ conversationId }) => {
      socket
        .to(`conversation:${conversationId}`)
        .emit("typing:stop", { userId, conversationId });
    });

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          lastDisconnectedAt.set(userId, new Date());
          io.emit("presence:update", { userId, online: false });
        }
      }
      logger.info(`Socket disconnected: user ${userId} (${socket.id})`);
    });
  });

  return io;
}

export function getIO() {
  if (!io)
    throw new Error(
      "Socket.io not initialized — call initSocket(server) first",
    );
  return io;
}

export function isUserOnline(userId) {
  return onlineUsers.has(userId.toString());
}

export function emitToUser(userId, event, payload) {
  if (!io) return;
  const sockets = onlineUsers.get(userId.toString());
  if (!sockets) return;
  sockets.forEach((socketId) => io.to(socketId).emit(event, payload));
}
