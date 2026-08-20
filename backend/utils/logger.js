import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const errorLogPath = path.join(logDir, "error.log");
const combinedLogPath = path.join(logDir, "combined.log");

function write(filePath, line) {
  try {
    fs.appendFileSync(filePath, line + "\n");
  } catch {}
}

function format(level, message) {
  return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
}

export const logger = {
  info(message) {
    const line = format("info", message);
    console.log(line);
    write(combinedLogPath, line);
  },
  warn(message) {
    const line = format("warn", message);
    console.warn(line);
    write(combinedLogPath, line);
  },
  error(message) {
    const line = format("error", message);
    console.error(line);
    write(combinedLogPath, line);
    write(errorLogPath, line);
  },
};
