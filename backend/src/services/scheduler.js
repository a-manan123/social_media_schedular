import cron from "node-cron";
import Post from "../models/Post.js";
import PublicationLog from "../models/PublicationLog.js";
import { POST_STATUS } from "../utils/constants.js";

// Check for posts to publish every minute
export const startScheduler = () => {
  // Run every minute: '* * * * *'
  cron.schedule("* * * * *", async () => {
    try {
      console.log("⏰ Scheduler running at:", new Date().toISOString());
      await publishScheduledPosts();
    } catch (error) {
      console.error("❌ Scheduler error:", error);
    }
  });
};

// Main function to publish scheduled posts
const publishScheduledPosts = async () => {
  try {
    const now = new Date();

    // Find all scheduled posts that need to be published
    // Use lean() for better performance since we're updating anyway
    const postsToPublish = await Post.find({
      status: POST_STATUS.SCHEDULED,
      scheduledAt: { $lte: now },
    })
      .sort({ createdAt: 1 }) // Order by creation time (FIFO)
      .lean();

    if (postsToPublish.length === 0) {
      console.log("✅ No posts to publish");
      return;
    }

    console.log(`📝 Found ${postsToPublish.length} post(s) to publish`);

    // Process each post
    for (const post of postsToPublish) {
      try {
        await publishPost(post);
      } catch (error) {
        console.error(`❌ Failed to publish post ${post._id}:`, error);
        // Mark post as failed
        await Post.findByIdAndUpdate(post._id, {
          status: POST_STATUS.FAILED,
        });

        // Create failed publication log
        await PublicationLog.create({
          post: post._id,
          user: post.user,
          scheduledAt: post.scheduledAt,
          platforms: post.platforms,
          status: "failed",
          errorMessage: error.message,
        });
      }
    }
  } catch (error) {
    console.error("❌ Error in publishScheduledPosts:", error);
  }
};

// Publish a single post
const publishPost = async (post) => {
  try {
    const publishedAt = new Date();

    // Update post status to published
    await Post.findByIdAndUpdate(post._id, {
      status: POST_STATUS.PUBLISHED,
      publishedAt: publishedAt,
    });

    // Create publication log
    await PublicationLog.create({
      post: post._id,
      user: post.user,
      scheduledAt: post.scheduledAt,
      publishedAt: publishedAt,
      platforms: post.platforms,
      status: "success",
    });

    console.log(
      `✅ Published post ${post._id} to ${post.platforms.join(", ")}`
    );

    // Here you would integrate with actual social media APIs
    // For now, we just simulate the publication
    return true;
  } catch (error) {
    console.error(`❌ Error publishing post ${post._id}:`, error);
    throw error;
  }
};

// Helper function to manually trigger publishing (for testing)
export const triggerPublishing = async () => {
  console.log("🔧 Manually triggering publishing...");
  await publishScheduledPosts();
};
