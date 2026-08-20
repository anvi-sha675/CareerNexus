import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/authValidators.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  authController.register,
);
router.post(
  "/login",
  authLimiter,
  loginValidator,
  validate,
  authController.login,
);
router.post("/logout", protect, authController.logout);
router.post("/refresh-token", authController.refresh);
router.post(
  "/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  validate,
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  authLimiter,
  resetPasswordValidator,
  validate,
  authController.resetPassword,
);
router.post("/verify-email", authController.verifyEmail);
router.get("/me", protect, authController.getMe);

export default router;
