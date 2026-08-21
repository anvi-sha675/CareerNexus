import { resumeService } from "../services/resumeService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const resume = await resumeService.uploadAndParse({
    studentId: req.user._id,
    file: req.file,
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Resume uploaded and parsed",
    data: resume,
  });
});

export const getActiveResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getActiveResume(req.user._id);
  sendSuccess(res, { data: resume });
});

export const listResumes = asyncHandler(async (req, res) => {
  const resumes = await resumeService.listResumes(req.user._id);
  sendSuccess(res, { data: resumes });
});

export const updateParsedFields = asyncHandler(async (req, res) => {
  const resume = await resumeService.updateParsedFields(
    req.params.id,
    req.user._id,
    req.body,
  );
  sendSuccess(res, { message: "Resume details updated", data: resume });
});
