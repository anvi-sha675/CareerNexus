import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { logger } from "./utils/logger.js";
import { sendSuccess } from "./utils/apiResponse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.cookieSecret));

  if (env.nodeEnv !== "test") {
    app.use(
      morgan(env.nodeEnv === "production" ? "combined" : "dev", {
        stream: { write: (msg) => logger.info(msg.trim()) },
      }),
    );
  }

  // Static file serving for uploaded resumes/avatars/logos/covers/gallery images.
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.get("/health", (req, res) => {
    sendSuccess(res, {
      message: "CareerNexus API is healthy",
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        env: env.nodeEnv,
      },
    });
  });

  app.use(`/api/${env.apiVersion}`, apiLimiter, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
