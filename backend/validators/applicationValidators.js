import { body, param } from "express-validator";
import { APPLICATION_STATUS } from "../constants/index.js";

export const updateStatusValidator = [
  param("id").isMongoId().withMessage("Invalid application id"),
  body("status")
    .isIn(Object.values(APPLICATION_STATUS))
    .withMessage("Invalid status"),
];
