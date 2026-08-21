import { applicationService } from "../services/applicationService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const applyToJob = asyncHandler(async (req, res) => {
  const application = await applicationService.apply(
    req.user._id,
    req.params.jobId,
  );
  sendSuccess(res, {
    statusCode: 201,
    message: "Application submitted successfully",
    data: application,
  });
});

export const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.withdraw(
    req.user._id,
    req.params.id,
  );
  sendSuccess(res, { message: "Application withdrawn", data: application });
});

export const listMyApplications = asyncHandler(async (req, res) => {
  const { applications, meta } = await applicationService.listForStudent(
    req.user._id,
    req.query,
  );
  sendSuccess(res, { data: applications, meta });
});

export const getMyApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.getForStudent(
    req.user._id,
    req.params.id,
  );
  sendSuccess(res, { data: application });
});

export const listApplicantsForJob = asyncHandler(async (req, res) => {
  const { applications, meta } = await applicationService.listForJob(
    req.user._id,
    req.params.jobId,
    req.query,
  );
  sendSuccess(res, { data: applications, meta });
});

export const listAllApplicants = asyncHandler(async (req, res) => {
  const { applications, meta } = await applicationService.listAllForRecruiter(
    req.user._id,
    req.query,
  );
  sendSuccess(res, { data: applications, meta });
});

export const getApplicantDetail = asyncHandler(async (req, res) => {
  const application = await applicationService.getApplicantDetail(
    req.user._id,
    req.params.id,
  );
  sendSuccess(res, { data: application });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateStatus(
    req.user._id,
    req.params.id,
    req.body.status,
    req.body.note,
  );
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `Set application ${application._id} status to ${req.body.status}`,
    targetType: "Application",
    targetId: application._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, {
    message: "Application status updated",
    data: application,
  });
});
