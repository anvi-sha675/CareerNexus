import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import * as reportController from "../controllers/reportController.js";
import { protect, authorize } from "../middleware/auth.js";
import { ROLES } from "../constants/index.js";

const router = Router();
router.use(protect, authorize(ROLES.ADMIN));

router.get("/users", adminController.listUsers);
router.get("/users/:id", adminController.getUser);
router.patch("/users/:id/status", adminController.setUserStatus);
router.delete("/users/:id", adminController.deleteUser);

router.get("/recruiters", adminController.listRecruiters);
router.patch("/recruiters/:userId/status", adminController.setRecruiterStatus);

router.get("/companies", adminController.listCompanies);
router.patch("/companies/:id/verify", adminController.verifyCompany);

router.get("/jobs", adminController.listJobsForModeration);
router.patch("/jobs/:id/moderate", adminController.moderateJob);

router.get("/analytics", adminController.getPlatformAnalytics);
router.get("/audit-logs", adminController.getAuditLogs);

router.get("/settings", adminController.getSystemSettings);
router.patch("/settings", adminController.updateSystemSetting);

router.get("/reports", reportController.listReports);
router.post("/reports", reportController.generateReport);
router.get("/reports/:id/csv", reportController.downloadReportCsv);
router.get("/reports/:id/pdf", reportController.downloadReportPdf);

export default router;
