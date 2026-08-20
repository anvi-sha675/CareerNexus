import { authService } from "../services/authService.js";
import { auditService } from "../services/auditService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookie(res, token) {
  res.cookie("token", token, cookieOptions);
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  setAuthCookie(res, result.accessToken);
  await auditService.log({
    actor: result.user._id,
    action: "create",
    description: `${result.user.role} account registered`,
  });
  sendSuccess(res, {
    statusCode: 201,
    message: "Account created successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setAuthCookie(res, result.accessToken);
  await auditService.log({
    actor: result.user._id,
    action: "login",
    description: "User logged in",
    ipAddress: req.ip,
  });
  sendSuccess(res, { message: "Logged in successfully", data: result });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  res.clearCookie("token", cookieOptions);
  sendSuccess(res, { message: "Logged out successfully" });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const result = await authService.refresh(token);
  setAuthCookie(res, result.accessToken);
  sendSuccess(res, { message: "Token refreshed", data: result });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  sendSuccess(res, { message: result.message });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  sendSuccess(res, { message: result.message });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body.token || req.query.token;
  const result = await authService.verifyEmail(token);
  sendSuccess(res, { message: "Email verified successfully", data: result });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  sendSuccess(res, { data: user });
});
