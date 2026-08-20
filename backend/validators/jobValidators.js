import { body, param } from "express-validator";
import { JOB_TYPES, EXPERIENCE_LEVELS } from "../constants/index.js";

const isDraft = (req) =>
  req.body.isDraft === true || req.body.isDraft === "true";

export const createJobValidator = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("isDraft").optional().isBoolean().toBoolean(),
  body("location")
    .if((v, { req }) => !isDraft(req))
    .trim()
    .notEmpty()
    .withMessage("Location is required"),
  body("type").optional().isIn(JOB_TYPES),
  body("experience").optional().isIn(EXPERIENCE_LEVELS),
  body("salaryMin")
    .if((v, { req }) => !isDraft(req))
    .isNumeric()
    .withMessage("Minimum salary is required"),
  body("salaryMax")
    .if((v, { req }) => !isDraft(req))
    .isNumeric()
    .withMessage("Maximum salary is required"),
  body("description")
    .if((v, { req }) => !isDraft(req))
    .trim()
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters"),
  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Enter a valid deadline date"),
];

export const jobIdValidator = [
  param("id").isMongoId().withMessage("Invalid job id"),
];
