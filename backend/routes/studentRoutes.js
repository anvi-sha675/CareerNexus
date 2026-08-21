import { Router } from "express";
import * as studentController from "../controllers/studentController.js";
import * as resumeController from "../controllers/resumeController.js";
import * as resumeBuilderController from "../controllers/resumeBuilderController.js";
import * as interviewController from "../controllers/interviewController.js";
import { protect, authorize } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";
import { ROLES } from "../constants/index.js";

const router = Router();
router.use(protect, authorize(ROLES.STUDENT));

router.get("/profile", studentController.getProfile);
router.patch("/profile", studentController.updateProfile);
router.get("/dashboard", studentController.getDashboard);
router.get("/interviews", interviewController.listStudentInterviews);

router.get("/resume-builder", resumeBuilderController.getBuilderData);
router.patch("/resume-builder", resumeBuilderController.updateBuilderMeta);
router.get("/resume-builder/export", resumeBuilderController.exportBuilderPdf);

router.get("/saved-jobs", studentController.listSavedJobs);
router.post("/saved-jobs/:jobId", studentController.saveJob);
router.delete("/saved-jobs/:jobId", studentController.unsaveJob);

router.get("/skills", studentController.skillsController.list);
router.post("/skills", studentController.skillsController.create);
router.patch("/skills/:id", studentController.skillsController.update);
router.delete("/skills/:id", studentController.skillsController.remove);

router.get("/education", studentController.educationController.list);
router.post("/education", studentController.educationController.create);
router.patch("/education/:id", studentController.educationController.update);
router.delete("/education/:id", studentController.educationController.remove);

router.get("/experience", studentController.experienceController.list);
router.post("/experience", studentController.experienceController.create);
router.patch("/experience/:id", studentController.experienceController.update);
router.delete("/experience/:id", studentController.experienceController.remove);

router.get("/projects", studentController.projectsController.list);
router.post("/projects", studentController.projectsController.create);
router.patch("/projects/:id", studentController.projectsController.update);
router.delete("/projects/:id", studentController.projectsController.remove);

router.get("/certifications", studentController.certificationsController.list);
router.post(
  "/certifications",
  studentController.certificationsController.create,
);
router.patch(
  "/certifications/:id",
  studentController.certificationsController.update,
);
router.delete(
  "/certifications/:id",
  studentController.certificationsController.remove,
);

router.post(
  "/resume",
  uploadResume.single("resume"),
  resumeController.uploadResume,
);
router.get("/resume", resumeController.getActiveResume);
router.get("/resume/all", resumeController.listResumes);
router.patch("/resume/:id", resumeController.updateParsedFields);

export default router;
