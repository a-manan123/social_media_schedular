import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Send token in HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // blocks JS access (secure)
    secure: process.env.NODE_ENV !== "development", // only HTTPS in prod
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
