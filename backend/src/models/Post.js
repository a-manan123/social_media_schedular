import mongoose from "mongoose";
import { POST_STATUS } from "../utils/constants.js";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [500, "Content cannot exceed 500 characters"],
      trim: true,
    },
    platforms: {
      type: [String],
      enum: ["Twitter", "Facebook", "Instagram"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one platform must be selected.",
      },
    },
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled date/time is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Scheduled time must be a future date/time.",
      },
    },
    publishedAt: { type: Date },

    imageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(POST_STATUS),
      default: POST_STATUS.SCHEDULED,
    },
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ user: 1, status: 1 });
postSchema.index({ status: 1, scheduledAt: 1 }); // Critical for scheduler
postSchema.index({ user: 1, scheduledAt: 1 });

// Compound index for the scheduler query
postSchema.index({
  status: 1,
  scheduledAt: 1,
  createdAt: 1,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
