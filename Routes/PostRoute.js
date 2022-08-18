import express from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  getTimelinePosts,
  likePost,
  updatePost,
  uploadMyPhotoPost,
  uploadMyPhotoResize,
  getMyPosts,
  getUserPost
  
} from "../Controllers/PostController.js";
import { protect, restrictTo } from "../Controllers/AuthController.js";
const router = express.Router();
router.get("/:userId/getuserpost",protect,getUserPost)
router.get("/mypost/:userId",protect,getMyPosts)
router.get("/timelinepost", protect, restrictTo("user"), getTimelinePosts);
router
  .route("/")
  .post(protect,uploadMyPhotoPost,uploadMyPhotoResize, createPost)
  .get(protect, restrictTo("user"), getAllPost);
router
  .route("/:id")
  .patch(protect, updatePost)
  .delete(protect, deletePost)
  .get(protect, restrictTo("admin"), getPost);
router.patch("/:postId/favorite", protect, likePost);

export default router;
