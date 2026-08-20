import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, "..", "uploads");

function storageFor(subfolder) {
  const dir = path.join(uploadsRoot, subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

const resumeFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    return cb(null, true);
  cb(
    ApiError.badRequest("Only PDF, DOC, or DOCX files are allowed for resumes"),
  );
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(ApiError.badRequest("Only image files are allowed"));
};

const maxBytes = env.maxFileSizeMb * 1024 * 1024;

export const uploadResume = multer({
  storage: storageFor("resumes"),
  fileFilter: resumeFilter,
  limits: { fileSize: maxBytes },
});
export const uploadAvatar = multer({
  storage: storageFor("avatars"),
  fileFilter: imageFilter,
  limits: { fileSize: maxBytes },
});
export const uploadLogo = multer({
  storage: storageFor("logos"),
  fileFilter: imageFilter,
  limits: { fileSize: maxBytes },
});
export const uploadCover = multer({
  storage: storageFor("covers"),
  fileFilter: imageFilter,
  limits: { fileSize: maxBytes },
});
export const uploadGallery = multer({
  storage: storageFor("gallery"),
  fileFilter: imageFilter,
  limits: { fileSize: maxBytes * 2 },
});

const attachmentFilter = (req, file, cb) => {
  const allowed = [
    ".pdf",
    ".doc",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".txt",
    ".zip",
  ];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    return cb(null, true);
  cb(
    ApiError.badRequest(
      "This file type isn't supported as a message attachment",
    ),
  );
};
export const uploadAttachment = multer({
  storage: storageFor("attachments"),
  fileFilter: attachmentFilter,
  limits: { fileSize: maxBytes },
});
