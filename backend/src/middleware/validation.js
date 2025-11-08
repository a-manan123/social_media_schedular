import { body, validationResult } from "express-validator";

// Generic function to handle validation results
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: extractedErrors.join(", "),
    });
  }
  next();
};

// Auth Validations
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters."),
  body("email").isEmail().withMessage("A valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  validateRequest,
];

export const validateLogin = [
  body("email").isEmail().withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
  validateRequest,
];

// Post Validations
export const validatePost = [
  body("content")
    .notEmpty()
    .withMessage("Content is required.")
    .isLength({ max: 500 })
    .withMessage("Content cannot exceed 500 characters."),
  body("platforms")
    .isArray({ min: 1 })
    .withMessage("At least one platform must be selected."),
  body("scheduledAt")
    .notEmpty()
    .withMessage("Scheduled time is required.")
    .custom((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime()) || date <= new Date()) {
        throw new Error("Scheduled time must be a valid future date.");
      }
      return true;
    }),
  validateRequest,
];
