import { User, StudentProfile, RecruiterProfile } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateRawAndHashedToken,
  hashToken,
} from "../utils/tokens.js";
import { emailService } from "./emailService.js";
import { ROLES } from "../constants/index.js";

function issueTokens(user) {
  const payload = { id: user._id.toString(), role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export const authService = {
  async register({ name, email, password, role }) {
    const existing = await User.findOne({ email });
    if (existing)
      throw ApiError.conflict("An account with this email already exists");

    const user = await User.create({
      name,
      email,
      password,
      role: role || ROLES.STUDENT,
    });

    if (user.role === ROLES.STUDENT) {
      await StudentProfile.create({ user: user._id });
    } else if (user.role === ROLES.RECRUITER) {
      await RecruiterProfile.create({ user: user._id });
    }

    const { raw, hashed } = generateRawAndHashedToken();
    user.emailVerificationTokenHash = hashed;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    emailService.sendWelcomeEmail(user).catch(() => {});
    emailService.sendVerificationEmail(user, raw).catch(() => {});

    const tokens = issueTokens(user);
    await persistRefreshToken(user, tokens.refreshToken);
    return { user: user.toSafeObject(), ...tokens };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const match = await user.comparePassword(password);
    if (!match) throw ApiError.unauthorized("Invalid email or password");
    if (user.status === "suspended")
      throw ApiError.forbidden(
        "This account has been suspended. Contact support.",
      );

    user.lastLoginAt = new Date();
    const tokens = issueTokens(user);
    await persistRefreshToken(user, tokens.refreshToken);
    await user.save({ validateBeforeSave: false });

    return { user: user.toSafeObject(), ...tokens };
  },

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
  },

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.unauthorized("No refresh token provided");
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }
    const user = await User.findById(decoded.id).select("+refreshTokenHash");
    if (!user || !user.refreshTokenHash)
      throw ApiError.unauthorized(
        "Session no longer valid — please log in again",
      );

    const presentedHash = hashToken(refreshToken);
    if (presentedHash !== user.refreshTokenHash)
      throw ApiError.unauthorized(
        "Session no longer valid — please log in again",
      );

    const tokens = issueTokens(user);
    await persistRefreshToken(user, tokens.refreshToken);
    return { user: user.toSafeObject(), ...tokens };
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user)
      return {
        message:
          "If an account exists for that email, a reset link has been sent.",
      };

    const { raw, hashed } = generateRawAndHashedToken();
    user.passwordResetTokenHash = hashed;
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    await emailService.sendPasswordResetEmail(user, raw);
    return {
      message:
        "If an account exists for that email, a reset link has been sent.",
    };
  },

  async resetPassword({ token, password }) {
    const hashed = hashToken(token);
    const user = await User.findOne({
      passwordResetTokenHash: hashed,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetTokenHash +passwordResetExpires");

    if (!user)
      throw ApiError.badRequest("This reset link is invalid or has expired");

    user.password = password;
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokenHash = undefined;
    await user.save();

    return { message: "Password reset successfully. Please log in." };
  },

  async verifyEmail(token) {
    const hashed = hashToken(token);
    const user = await User.findOne({
      emailVerificationTokenHash: hashed,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationTokenHash +emailVerificationExpires");

    if (!user)
      throw ApiError.badRequest(
        "This verification link is invalid or has expired",
      );

    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return { verified: true };
  },

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound("User not found");
    return user.toSafeObject();
  },
};

async function persistRefreshToken(user, refreshToken) {
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });
}
