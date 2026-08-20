import dotenv from "dotenv";
dotenv.config();

const required = ["JWT_SECRET", "JWT_REFRESH_SECRET"];

if (process.env.NODE_ENV !== "test") {
  required.forEach((key) => {
    if (!process.env[key]) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(`Missing required environment variable: ${key}`);
      }
      console.warn(
        `⚠️  Missing env var ${key} — using an insecure development fallback. Set this before deploying.`,
      );
    }
  });
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  apiVersion: process.env.API_VERSION || "v1",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  mongoUri:
    process.env.NODE_ENV === "test"
      ? process.env.MONGODB_URI_TEST ||
        "mongodb://127.0.0.1:27017/careernexus_test"
      : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careernexus",

  jwtSecret: process.env.JWT_SECRET || "dev-insecure-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || "dev-insecure-refresh-secret-change-me",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  cookieSecret: process.env.COOKIE_SECRET || "dev-insecure-cookie-secret",

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "CareerNexus <no-reply@careernexus.io>",
  },

  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || "5", 10),

  rateLimit: {
    windowMin: parseInt(process.env.RATE_LIMIT_WINDOW_MIN || "15", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "200", 10),
  },
};
