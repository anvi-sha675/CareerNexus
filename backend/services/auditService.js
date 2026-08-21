import { AuditLog } from "../models/index.js";

export const auditService = {
  async log({
    actor,
    action,
    description,
    targetType = null,
    targetId = null,
    ipAddress = null,
  }) {
    try {
      await AuditLog.create({
        actor,
        action,
        description,
        targetType,
        targetId,
        ipAddress,
      });
    } catch {
      // Auditing must never block the primary request path.
    }
  },

  async list(query) {
    const limit = Math.min(parseInt(query.limit, 10) || 50, 200);
    return AuditLog.find()
      .populate("actor", "name email role")
      .sort({ createdAt: -1 })
      .limit(limit);
  },
};
