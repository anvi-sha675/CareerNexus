import { Router } from "express";
import * as recruiterController from "../controllers/recruiterController.js";
import * as jobController from "../controllers/jobController.js";
import * as applicationController from "../controllers/applicationController.js";
import * as interviewController from "../controllers/interviewController.js";
import { protect, authorize } from "../middleware/auth.js";
import {
  uploadLogo,
  uploadCover,
  uploadGallery,
} from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { scheduleInterviewValidator } from "../validators/interviewValidators.js";
import { updateStatusValidator } from "../validators/applicationValidators.js";
import { ROLES } from "../constants/index.js";

const router = Router();
router.use(protect, authorize(ROLES.RECRUITER));

router.get("/dashboard", recruiterController.getDashboard);
router.get("/analytics", recruiterController.getAnalytics);

router.get("/company", recruiterController.getCompanyProfile);
router.patch("/company", recruiterController.updateCompanyProfile);
router.post(
  "/company/logo",
  uploadLogo.single("logo"),
  recruiterController.uploadLogo,
);
router.post(
  "/company/cover",
  uploadCover.single("cover"),
  recruiterController.uploadCover,
);
router.post(
  "/company/gallery",
  uploadGallery.single("image"),
  recruiterController.addGalleryImage,
);
router.delete("/company/gallery", recruiterController.removeGalleryImage);

router.get("/jobs", jobController.listMyJobs);
router.get("/applicants", applicationController.listAllApplicants);
router.get("/applicants/:id", applicationController.getApplicantDetail);
router.patch(
  "/applicants/:id/status",
  updateStatusValidator,
  validate,
  applicationController.updateApplicationStatus,
);

router.get("/interviews", interviewController.listRecruiterInterviews);
router.post(
  "/interviews",
  scheduleInterviewValidator,
  validate,
  interviewController.scheduleInterview,
);
router.patch(
  "/interviews/:id/reschedule",
  interviewController.rescheduleInterview,
);
router.patch("/interviews/:id/cancel", interviewController.cancelInterview);

export default router;
