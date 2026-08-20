export const ROLES = Object.freeze({
  STUDENT: "student",
  RECRUITER: "recruiter",
  ADMIN: "admin",
});

export const USER_STATUS = Object.freeze({
  ACTIVE: "active",
  SUSPENDED: "suspended",
  PENDING: "pending",
});

export const RECRUITER_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  SUSPENDED: "suspended",
});

export const JOB_STATUS = Object.freeze({
  DRAFT: "draft",
  ACTIVE: "active",
  CLOSED: "closed",
  ARCHIVED: "archived",
  FLAGGED: "flagged",
});

export const JOB_TYPES = Object.freeze([
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Remote",
]);
export const EXPERIENCE_LEVELS = Object.freeze([
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Lead",
]);

export const APPLICATION_STATUS = Object.freeze({
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  OFFERED: "Offered",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
});

export const INTERVIEW_STATUS = Object.freeze({
  SCHEDULED: "Scheduled",
  CONFIRMED: "Confirmed",
  RESCHEDULED: "Rescheduled",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
});

export const INTERVIEW_MODE = Object.freeze([
  "Video Call",
  "On-site",
  "Phone Call",
]);

export const NOTIFICATION_TYPE = Object.freeze({
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
});

export const NOTIFICATION_CATEGORY = Object.freeze({
  APPLICATION: "application",
  INTERVIEW: "interview",
  MESSAGE: "message",
  SYSTEM: "system",
  PROFILE: "profile",
});

export const COMPANY_VERIFICATION_STATUS = Object.freeze({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

export const AUDIT_ACTION = Object.freeze({
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  APPROVE: "approve",
  REJECT: "reject",
  SUSPEND: "suspend",
  LOGIN: "login",
});

export const SKILL_LEVELS = Object.freeze([
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
]);

export const PAGINATION_DEFAULTS = Object.freeze({
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
});
