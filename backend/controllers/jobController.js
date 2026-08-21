import { jobService } from "../services/jobService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const listJobs = asyncHandler(async (req, res) => {
  const { jobs, meta } = await jobService.list(req.query, req.user);
  sendSuccess(res, { data: jobs, meta });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getById(req.params.id, req.user);
  sendSuccess(res, { data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.create(req.user._id, req.body);
  await auditService.log({
    actor: req.user._id,
    action: "create",
    description: `${job.isDraft ? "Drafted" : "Published"} job "${job.title}"`,
    targetType: "Job",
    targetId: job._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, {
    statusCode: 201,
    message: job.isDraft ? "Job saved as draft" : "Job posted successfully",
    data: job,
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.update(req.user._id, req.params.id, req.body);
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `Updated job "${job.title}"`,
    targetType: "Job",
    targetId: job._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Job updated successfully", data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  await jobService.remove(req.user._id, req.params.id);
  await auditService.log({
    actor: req.user._id,
    action: "delete",
    description: `Deleted job ${req.params.id}`,
    targetType: "Job",
    targetId: req.params.id,
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Job deleted successfully" });
});

export const duplicateJob = asyncHandler(async (req, res) => {
  const job = await jobService.duplicate(req.user._id, req.params.id);
  sendSuccess(res, { statusCode: 201, message: "Job duplicated", data: job });
});

export const setJobStatus = asyncHandler(async (req, res) => {
  const job = await jobService.setStatus(
    req.user._id,
    req.params.id,
    req.body.status,
  );
  sendSuccess(res, { message: "Job status updated", data: job });
});

export const publishJob = asyncHandler(async (req, res) => {
  const job = await jobService.publish(req.user._id, req.params.id);
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `Published job "${job.title}"`,
    targetType: "Job",
    targetId: job._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Job published successfully", data: job });
});

export const archiveJob = asyncHandler(async (req, res) => {
  const job = await jobService.archive(req.user._id, req.params.id);
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `Archived job "${job.title}"`,
    targetType: "Job",
    targetId: job._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Job archived", data: job });
});

export const listMyJobs = asyncHandler(async (req, res) => {
  const { jobs, meta } = await jobService.listForRecruiter(
    req.user._id,
    req.query,
  );
  sendSuccess(res, { data: jobs, meta });
});
