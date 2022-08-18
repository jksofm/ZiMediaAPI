import express from "express";
import { protect, restrictTo } from "../Controllers/AuthController.js";
import { createComment, deleteComment, getAllComment, getAllCommentOfAPost, getComment, updateComment } from "../Controllers/CommentController.js";





const router = express.Router();

router.route("/").post(protect,createComment).get(protect,getAllComment)
router.route("/:id").patch(protect,updateComment).delete(protect,deleteComment).get(protect,getComment)

router.route("/post/:postIdComment").get(protect,getAllCommentOfAPost)


export default router;
