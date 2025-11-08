import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import { startScheduler } from "./services/scheduler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Connect to MongoDB BEFORE starting server
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware order matters — keep these first
app.use(express.json()); // Parse JSON body with size limit
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cookieParser()); // Parse cookies

//  CORS setup (for frontend + cookies)
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // In development, allow any localhost origin
      if (process.env.NODE_ENV !== "production") {
        if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
          return callback(null, true);
        }
      }
      
      // Check against allowed origins (for production or specific URLs)
      if (allowedOrigins.length > 0 && allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // Default: allow if no specific origins configured (development fallback)
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }
      
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

//  Health check
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "✅ Social Media Scheduler Backend is running..." });
});

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dashboard", dashboardRoutes);

//  Global error handler
app.use(errorHandler);

console.log("Scheduler started");
startScheduler();

//  Start server AFTER setup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
