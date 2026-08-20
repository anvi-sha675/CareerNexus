import http from "http";
import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { initSocket } from "./socket/index.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function start() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.port, () => {
    logger.info(
      `CareerNexus API listening on port ${env.port} [${env.nodeEnv}]`,
    );
    logger.info(`Health check: http://localhost:${env.port}/health`);
    logger.info(`API base: http://localhost:${env.port}/api/${env.apiVersion}`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      logger.info("Shutdown complete");
      process.exit(0);
    });
    // Force-exit
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled promise rejection: ${reason?.stack || reason}`);
  });
  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught exception: ${err.stack}`);
    process.exit(1);
  });
}

start().catch((err) => {
  logger.error(`Failed to start server: ${err.stack}`);
  process.exit(1);
});
