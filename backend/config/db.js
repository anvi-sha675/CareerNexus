import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    logger.info(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`,
    );
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});
