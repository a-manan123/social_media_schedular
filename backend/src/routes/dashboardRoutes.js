import express from "express";
import {
  getStats,
  getUpcomingPosts,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All dashboard routes are protected
router.use(protect);

router.get("/stats", getStats);
router.get("/upcoming", getUpcomingPosts);

export default router;
