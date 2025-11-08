// backend/src/controllers/dashboardController.js
import mongoose from "mongoose";
import Post from "../models/Post.js";
import PublicationLog from "../models/PublicationLog.js";
import { POST_STATUS } from "../utils/constants.js";

/**
 * @desc    Get dashboard statistics for logged-in user
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Use Promise.all for parallel counts
    const [total, scheduled, published, failed, draft] = await Promise.all([
      Post.countDocuments({ user: userId }),
      Post.countDocuments({ user: userId, status: POST_STATUS.SCHEDULED }),
      Post.countDocuments({ user: userId, status: POST_STATUS.PUBLISHED }),
      Post.countDocuments({ user: userId, status: POST_STATUS.FAILED }),
      Post.countDocuments({ user: userId, status: POST_STATUS.DRAFT }),
    ]);

    // Count posts by platform (convert userId to ObjectId for aggregation)
    const platformStats = await Post.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$platforms" },
      {
        $group: {
          _id: "$platforms",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPosts: total,
        scheduledPosts: scheduled,
        publishedPosts: published,
        failedPosts: failed,
        draftPosts: draft,
        platforms: platformStats.map((p) => ({
          platform: p._id,
          count: p.count,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get upcoming scheduled posts (next N - default 5)
 * @route   GET /api/dashboard/upcoming
 * @access  Private
 */
export const getUpcomingPosts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit, 10) || 5;

    const now = new Date();

    const upcomingPosts = await Post.find({
      user: userId,
      status: POST_STATUS.SCHEDULED,
      scheduledAt: { $gte: now }, // <- use scheduledAt
    })
      .sort({ scheduledAt: 1 }) // <- order by scheduledAt
      .limit(limit)
      .select("content platforms scheduledAt status")
      .lean();

    res.status(200).json({
      success: true,
      data: upcomingPosts,
    });
  } catch (err) {
    next(err);
  }
};
