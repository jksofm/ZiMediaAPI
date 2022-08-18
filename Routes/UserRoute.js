import express from "express";
import { restrictTo, protect } from "../Controllers/AuthController.js";

import {
  getAllUser,
  getUser,
  deleteUser,
  UpdateUser,
  followerUser,
  unfollowerUser,
  updateMydata,
  uploadInfoImages,
  resizeInfoImages
} from "../Controllers/UserController.js";

const router = express.Router();

router.patch("/:id/follow",protect,followerUser)
router.patch("/:id/unfollow",protect,unfollowerUser)
router.patch("/updatemydata",protect,uploadInfoImages,resizeInfoImages,updateMydata)





router.route("/").get(protect, getAllUser);
router
.route("/:id")
.get(protect, getUser)
.delete(protect, restrictTo("admin"), deleteUser)
.patch(protect, restrictTo("admin"), UpdateUser)




export default router;
