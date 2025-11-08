import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";
import { validatePost } from "../middleware/validation.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.route("/").get(getPosts).post(validatePost, createPost);

router
  .route("/:id")
  .get(getPostById)
  .put(validatePost, updatePost)
  .delete(deletePost);

export default router;
