import mongoose from "mongoose";

const publicationLogSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    platforms: [
      {
        type: String,
        enum: ["Twitter", "Facebook", "Instagram"],
      },
    ],
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
      default: "success",
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
publicationLogSchema.index({ post: 1 });
publicationLogSchema.index({ user: 1, publishedAt: -1 });
publicationLogSchema.index({ status: 1, publishedAt: -1 });

// Optional cleanup middleware
publicationLogSchema.pre("save", function (next) {
  if (this.status === "success") this.errorMessage = undefined;
  next();
});

const PublicationLog = mongoose.model("PublicationLog", publicationLogSchema);

export default PublicationLog;
