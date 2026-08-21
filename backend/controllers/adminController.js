import { userService } from "../services/userService.js";
import { companyService } from "../services/companyService.js";
import { jobService } from "../services/jobService.js";
import { analyticsService } from "../services/analyticsService.js";
import { auditService } from "../services/auditService.js";
import { SystemSetting } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await userService.list(req.query);
  sendSuccess(res, { data: users, meta });
});

export const getUser = asyncHandler(async (req, res) => {
  const result = await userService.getById(req.params.id);
  sendSuccess(res, { data: result });
});

export const setUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.setStatus(req.params.id, req.body.status);
  await auditService.log({
    actor: req.user._id,
    action: req.body.status === "suspended" ? "suspend" : "update",
    description: `Set ${user.email} status to ${req.body.status}`,
    targetType: "User",
    targetId: user._id,
  });
  sendSuccess(res, { message: "User status updated", data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.remove(req.params.id);
  await auditService.log({
    actor: req.user._id,
    action: "delete",
    description: `Deleted user ${req.params.id}`,
    targetType: "User",
    targetId: req.params.id,
  });
  sendSuccess(res, { message: "User deleted" });
});

export const listRecruiters = asyncHandler(async (req, res) => {
  const { recruiters, meta } = await userService.listRecruiters(req.query);
  sendSuccess(res, { data: recruiters, meta });
});

export const setRecruiterStatus = asyncHandler(async (req, res) => {
  const profile = await userService.setRecruiterStatus(
    req.params.userId,
    req.body.status,
  );
  await auditService.log({
    actor: req.user._id,
    action: req.body.status === "approved" ? "approve" : "reject",
    description: `Recruiter status set to ${req.body.status}`,
    targetType: "RecruiterProfile",
    targetId: profile._id,
  });
  sendSuccess(res, { message: "Recruiter status updated", data: profile });
});

export const listCompanies = asyncHandler(async (req, res) => {
  const { companies, meta } = await companyService.adminList(req.query);
  sendSuccess(res, { data: companies, meta });
});

export const verifyCompany = asyncHandler(async (req, res) => {
  const company = await companyService.verify(
    req.user._id,
    req.params.id,
    req.body,
  );
  await auditService.log({
    actor: req.user._id,
    action: req.body.status === "approved" ? "approve" : "reject",
    description: `Company ${company.name} ${req.body.status}`,
    targetType: "Company",
    targetId: company._id,
  });
  sendSuccess(res, { message: "Company verification updated", data: company });
});

export const listJobsForModeration = asyncHandler(async (req, res) => {
  const { jobs, meta } = await jobService.adminList(req.query);
  sendSuccess(res, { data: jobs, meta });
});

export const moderateJob = asyncHandler(async (req, res) => {
  const job = await jobService.moderate(req.params.id, req.body.action);
  await auditService.log({
    actor: req.user._id,
    action: req.body.action === "approve" ? "approve" : "reject",
    description: `Job "${job.title}" ${req.body.action}d`,
    targetType: "Job",
    targetId: job._id,
  });
  sendSuccess(res, { message: "Job moderated", data: job });
});

export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const [
    overview,
    userGrowth,
    applicationsTrend,
    userDistribution,
    hiringFunnel,
  ] = await Promise.all([
    analyticsService.getPlatformOverview(),
    analyticsService.getUserGrowth(),
    analyticsService.getApplicationsTrend(),
    analyticsService.getUserDistribution(),
    analyticsService.getHiringFunnel(),
  ]);
  sendSuccess(res, {
    data: {
      overview,
      userGrowth,
      applicationsTrend,
      userDistribution,
      hiringFunnel,
    },
  });
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await auditService.list(req.query);
  sendSuccess(res, { data: logs });
});

export const getSystemSettings = asyncHandler(async (req, res) => {
  const settings = await SystemSetting.find();
  sendSuccess(res, { data: settings });
});

export const updateSystemSetting = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  const setting = await SystemSetting.findOneAndUpdate(
    { key },
    { value, updatedBy: req.user._id },
    { new: true, upsert: true },
  );
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `System setting "${key}" updated`,
  });
  sendSuccess(res, { message: "Setting updated", data: setting });
});
