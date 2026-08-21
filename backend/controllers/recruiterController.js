import { recruiterService } from "../services/recruiterService.js";
import { companyService } from "../services/companyService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await recruiterService.getDashboardStats(req.user._id);
  sendSuccess(res, { data: stats });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await recruiterService.getAnalytics(req.user._id);
  sendSuccess(res, { data: analytics });
});

export const getCompanyProfile = asyncHandler(async (req, res) => {
  const company = await companyService.getForRecruiter(req.user._id);
  sendSuccess(res, { data: company });
});

export const updateCompanyProfile = asyncHandler(async (req, res) => {
  const company = await companyService.createOrUpdate(req.user._id, req.body);
  await auditService.log({
    actor: req.user._id,
    action: "update",
    description: `Updated company profile for "${company.name}"`,
    targetType: "Company",
    targetId: company._id,
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Company profile updated", data: company });
});

export const uploadLogo = asyncHandler(async (req, res) => {
  const company = await companyService.createOrUpdate(req.user._id, {
    logo: `/uploads/logos/${req.file.filename}`,
  });
  sendSuccess(res, { message: "Logo updated", data: company });
});

export const uploadCover = asyncHandler(async (req, res) => {
  const company = await companyService.createOrUpdate(req.user._id, {
    coverImage: `/uploads/covers/${req.file.filename}`,
  });
  sendSuccess(res, { message: "Cover image updated", data: company });
});

export const addGalleryImage = asyncHandler(async (req, res) => {
  const company = await companyService.addGalleryImage(
    req.user._id,
    `/uploads/gallery/${req.file.filename}`,
  );
  sendSuccess(res, { message: "Gallery image added", data: company });
});

export const removeGalleryImage = asyncHandler(async (req, res) => {
  const company = await companyService.removeGalleryImage(
    req.user._id,
    req.body.imageUrl,
  );
  sendSuccess(res, { message: "Gallery image removed", data: company });
});
