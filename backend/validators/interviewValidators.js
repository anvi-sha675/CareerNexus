import { body } from "express-validator";
import { INTERVIEW_MODE } from "../constants/index.js";

export const scheduleInterviewValidator = [
  body("applicationId").isMongoId().withMessage("Invalid application id"),
  body("scheduledDate").isISO8601().withMessage("A valid date is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("mode").optional().isIn(INTERVIEW_MODE),
  body("interviewerName")
    .trim()
    .notEmpty()
    .withMessage("Interviewer name is required"),
];
