import { Router } from "express";
import * as applicationController from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import { ROLES } from "../constants/index.js";

const router = Router();
router.use(protect, authorize(ROLES.STUDENT));

router.get("/", applicationController.listMyApplications);
router.get("/:id", applicationController.getMyApplication);
router.patch("/:id/withdraw", applicationController.withdrawApplication);

export default router;
