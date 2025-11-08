// backend/src/utils/constants.js

export const ERROR_MESSAGES = {
  EMAIL_EXISTS: "Email already exists.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  NOT_AUTHORIZED: "Not authorized to access this resource.",
  INVALID_TOKEN: "Token is invalid or expired.",
  USER_NOT_FOUND: "User not found.",
};

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "User registered successfully.",
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "Logout successful.",
  POST_CREATED: "Post created successfully.",
  POST_UPDATED: "Post updated successfully.",
  POST_DELETED: "Post deleted successfully.",
};

export const POST_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  FAILED: "failed",
};

export const PLATFORMS = {
  TWITTER: "Twitter",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
};
