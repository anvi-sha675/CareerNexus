import { Router } from "express";
import * as jobController from "../controllers/jobController.js";
import * as applicationController from "../controllers/applicationController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createJobValidator,
  jobIdValidator,
} from "../validators/jobValidators.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.get("/", optionalAuth, jobController.listJobs);
router.get(
  "/:id",
  jobIdValidator,
  validate,
  optionalAuth,
  jobController.getJob,
);

router.post(
  "/",
  protect,
  authorize(ROLES.RECRUITER),
  createJobValidator,
  validate,
  jobController.createJob,
);
router.patch(
  "/:id",
  protect,
  authorize(ROLES.RECRUITER),
  jobIdValidator,
  validate,
  jobController.updateJob,
);
router.delete(
  "/:id",
  protect,
  authorize(ROLES.RECRUITER),
  jobIdValidator,
  validate,
  jobController.deleteJob,
);
router.post(
  "/:id/duplicate",
  protect,
  authorize(ROLES.RECRUITER),
  jobIdValidator,
  validate,
  jobController.duplicateJob,
);
router.patch(
  "/:id/status",
  protect,
  authorize(ROLES.RECRUITER),
  jobIdValidator,
  validate,
  jobController.setJobStatus,
);
router.post(
  "/:id/publish",
  protect,
  authorize(ROLES.RECRUITER),
  jobIdValidator,
  validate,
  jobController.publishJob,
);
router.post(
  "/:id/archive",
  protect,
  authorize(ROLES.RECRUITER),
  jobIdValidator,
  validate,
  jobController.archiveJob,
);
router.get(
  "/:jobId/applicants",
  protect,
  authorize(ROLES.RECRUITER),
  applicationController.listApplicantsForJob,
);
router.post(
  "/:jobId/apply",
  protect,
  authorize(ROLES.STUDENT),
  applicationController.applyToJob,
);

export default router;
