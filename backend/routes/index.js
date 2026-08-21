import { Router } from "express";
import authRoutes from "./authRoutes.js";
import studentRoutes from "./studentRoutes.js";
import jobRoutes from "./jobRoutes.js";
import applicationRoutes from "./applicationRoutes.js";
import recruiterRoutes from "./recruiterRoutes.js";
import adminRoutes from "./adminRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import messageRoutes from "./messageRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/student", studentRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/recruiter", recruiterRoutes);
router.use("/admin", adminRoutes);
router.use("/notifications", notificationRoutes);
router.use("/messages", messageRoutes);

export default router;
