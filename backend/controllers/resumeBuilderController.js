import { resumeBuilderService } from "../services/resumeBuilderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getBuilderData = asyncHandler(async (req, res) => {
  const data = await resumeBuilderService.getBuilderData(req.user._id);
  sendSuccess(res, { data });
});

export const updateBuilderMeta = asyncHandler(async (req, res) => {
  const profile = await resumeBuilderService.updateMeta(req.user._id, req.body);
  sendSuccess(res, { message: "Resume draft saved", data: profile });
});

export const exportBuilderPdf = asyncHandler(async (req, res) => {
  const pdfBuffer = await resumeBuilderService.exportPdf(req.user._id);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="resume.pdf"');
  res.send(pdfBuffer);
});
