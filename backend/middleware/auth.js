import { User } from "../models/index.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token = null;
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token)
    throw ApiError.unauthorized(
      "You must be logged in to access this resource",
    );

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized(
      "Session expired or invalid — please log in again",
    );
  }

  const user = await User.findById(decoded.id);
  if (!user)
    throw ApiError.unauthorized(
      "The account for this session no longer exists",
    );
  if (user.status === "suspended")
    throw ApiError.forbidden("This account has been suspended");

  req.user = user;
  next();
});

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) throw ApiError.unauthorized();
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `This action requires one of the following roles: ${roles.join(", ")}`,
      );
    }
    next();
  };

export const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token =
    header && header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : req.cookies?.token;
  if (!token) return next();
  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (user && user.status !== "suspended") req.user = user;
  } catch {}
  next();
});
