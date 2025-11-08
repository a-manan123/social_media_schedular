import Post from "../models/Post.js";
import PublicationLog from "../models/PublicationLog.js";
import { POST_STATUS } from "../utils/constants.js";

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res, next) => {
  try {
    const { content, platforms, scheduledAt, imageUrl, status } = req.body;

    // Validate required fields
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Post content is required.",
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot exceed 500 characters.",
      });
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one platform must be selected.",
      });
    }

    // Validate platforms are valid
    const validPlatforms = ["Twitter", "Facebook", "Instagram"];
    const invalidPlatforms = platforms.filter(
      (p) => !validPlatforms.includes(p)
    );
    if (invalidPlatforms.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid platforms: ${invalidPlatforms.join(", ")}`,
      });
    }

    // Validate scheduledAt
    if (!scheduledAt || isNaN(new Date(scheduledAt).getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid scheduled date/time is required.",
      });
    }

    if (new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled time must be a future date/time.",
      });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      platforms,
      scheduledAt,
      imageUrl,
      status: status || POST_STATUS.SCHEDULED,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all posts (paginated & filterable)
 * @route   GET /api/posts
 * @access  Private
 */
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { user: req.user._id };
    if (status) query.status = status;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get a single post
 * @route   GET /api/posts/:id
 * @access  Private
 */
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).lean();

    if (!post || post.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Post not found or access denied.",
      });
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update post (only if not published)
 * @route   PUT /api/posts/:id
 * @access  Private
 */
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Post not found or access denied.",
      });
    }

    if (post.status === POST_STATUS.PUBLISHED) {
      return res.status(400).json({
        success: false,
        message: "Published posts cannot be edited.",
      });
    }

    const updates = req.body;

    // Validate content if provided
    if (updates.content !== undefined) {
      if (!updates.content || updates.content.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Post content cannot be empty.",
        });
      }
      if (updates.content.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Post content cannot exceed 500 characters.",
        });
      }
    }

    // Validate platforms if provided
    if (updates.platforms) {
      const validPlatforms = ["Twitter", "Facebook", "Instagram"];
      const invalidPlatforms = updates.platforms.filter(
        (p) => !validPlatforms.includes(p)
      );
      if (invalidPlatforms.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid platforms: ${invalidPlatforms.join(", ")}`,
        });
      }
    }

    // Revalidate scheduled time
    if (updates.scheduledAt && new Date(updates.scheduledAt) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled time must be a future date/time.",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: updatedPost,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Post not found or access denied.",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get total posts count
    const totalPosts = await Post.countDocuments({ user: userId });

    // Get scheduled posts count
    const scheduledPosts = await Post.countDocuments({
      user: userId,
      status: POST_STATUS.SCHEDULED,
    });

    // Get published posts count
    const publishedPosts = await Post.countDocuments({
      user: userId,
      status: POST_STATUS.PUBLISHED,
    });

    // Get posts by platform
    const postsByPlatform = await Post.aggregate([
      { $match: { user: userId } },
      { $unwind: "$platforms" },
      { $group: { _id: "$platforms", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPosts,
        scheduledPosts,
        publishedPosts,
        postsByPlatform: postsByPlatform.map((item) => ({
          platform: item._id,
          count: item.count,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get upcoming scheduled posts
 * @route   GET /api/dashboard/upcoming
 * @access  Private
 */
export const getUpcomingPosts = async (req, res, next) => {
  try {
    const upcomingPosts = await Post.find({
      user: req.user._id,
      status: POST_STATUS.SCHEDULED,
      scheduledAt: { $gte: new Date() },
    })
      .sort({ scheduledAt: 1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: upcomingPosts,
    });
  } catch (err) {
    next(err);
  }
};

// In postController.js
export const getPublicationLogs = async (req, res, next) => {
  try {
    const logs = await PublicationLog.find({ user: req.user._id })
      .populate("post", "content platforms")
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};
