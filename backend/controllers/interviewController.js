import { interviewService } from "../services/interviewService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const scheduleInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.schedule(req.user._id, req.body);
  await auditService.log({
    actor: req.user._id,
    action: "create",
    description: `Scheduled interview ${interview._id}`,
    targetType: "Interview",
    targetId: interview._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Interview scheduled",
    data: interview,
  });
});

export const rescheduleInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.reschedule(
    req.user._id,
    req.params.id,
    req.body,
  );
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `Rescheduled interview ${interview._id}`,
    targetType: "Interview",
    targetId: interview._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Interview rescheduled", data: interview });
});

export const cancelInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.cancel(req.user._id, req.params.id);
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `Cancelled interview ${interview._id}`,
    targetType: "Interview",
    targetId: interview._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Interview cancelled", data: interview });
});

export const listRecruiterInterviews = asyncHandler(async (req, res) => {
  const interviews = await interviewService.listForRecruiter(req.user._id);
  sendSuccess(res, { data: interviews });
});

export const listStudentInterviews = asyncHandler(async (req, res) => {
  const interviews = await interviewService.listForStudent(req.user._id);
  sendSuccess(res, { data: interviews });
});
