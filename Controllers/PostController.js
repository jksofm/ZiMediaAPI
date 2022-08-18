import PostModel from "../Models/postModel.js";
import multer from "multer";
import mongoose from "mongoose";
import sharp from "sharp";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./HandleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import UserModel from "../Models/userModel.js";
import AppError from "../utils/AppError.js";

export const createPost = createOne(PostModel);
export const getPost = getOne(PostModel);
export const deletePost = deleteOne(PostModel);
export const getAllPost = getAll(PostModel);
export const updatePost = updateOne(PostModel);
export const likePost = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  // const user = await findById(userId)
  const postId = req.params.postId;
  console.log("postid", postId);
  const post = await PostModel.findById(postId);
  let newPost;
  
  if (!post.likes.includes(userId)) {
    newPost = await post.updateOne({ $push: { likes: userId } });
  } else {
    newPost = await post.updateOne({ $pull: { likes: userId } });
  }

  res.status(200).json({
    status: "success",
    newPost,
  });
});
export const getUserPost = getAll(PostModel,{path:"userId","select": "username"})
export const getMyPosts = getAll(PostModel,{path:"userId","select": "username"});

export const getTimelinePosts = catchAsync(async (req, res) => {
  const userId = req.user.id;
  console.log("user" , req.user)
  console.log(userId);
  const currentUserPosts = await PostModel.find({ userId: userId }).populate({path:"userId","select": "username"});;
  //  console.log("my post",currentUserPosts);
  const idArrayFollowings = req.user.followings;
 
  const followingsUserPosts = await PostModel.find({
    userId: { $in: idArrayFollowings },
  }).populate({path:"userId","select": "username"});
  // console.log("follow",followingsUserPosts)
   const post =[...followingsUserPosts, ...currentUserPosts].sort((a,b)=>{
    return b.createdAt - a.createdAt
   })
  res.status(200).json({
    status: "success",
    length : [...followingsUserPosts, ...currentUserPosts].length,
    data: {
      // UserPosts : currentUserPosts,
      // UserFollowingsPosts : followingsUserPosts,
      post 
    },
  });

  // const followingPosts = await UserModel.aggregate([
  //     {
  //         $match : {
  //             _id : new mongoose.Types.ObjectId(userId)
  //         },

  //     },
  //     {
  //         $lookup : {
  //             from : "Post",
  //             localField : "followings",
  //             foreignField : "userId",
  //             as : "followingPosts",

  //         }
  //     },
  //     {
  //         $project : {
  //             followingPosts : 1,
  //             // _id : 0
  //         }
  //     }
  // ])
  // console.log(followingPosts);
  //   res.status(200).json({
  //     status : "success",
  //     data : {
  //         UserPosts : currentUserPosts,
  //         followingPosts
  //     }
  // })
});
//////// Tạo post
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 404), false);
  }
};
const multerStorage = multer.memoryStorage();
export const uploadMyPhotoResize = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user--${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/posts/${req.file.filename}`);

  next();
});
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
export const uploadMyPhotoPost = upload.single("image");
