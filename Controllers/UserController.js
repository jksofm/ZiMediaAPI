import UserModel from "../Models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { getOne, getAll, deleteOne, updateOne } from "./HandleFactory.js";
import sharp from "sharp";
import multer from "multer";
export const getUser = getOne(UserModel);
export const getAllUser = getAll(UserModel);
export const deleteUser = deleteOne(UserModel);
export const UpdateUser = updateOne(UserModel);

export const followerUser = catchAsync(async (req, res, next) => {
  const idUserfollowed = req.params.id;
  const currentUserId = req.user.id;
  if (idUserfollowed === currentUserId)
    return next(new AppError("You cannot follow yourself", 400));
  const followedUser = await UserModel.findById(idUserfollowed);
  if (!followedUser) return next(new AppError("There is no such user", 400));
  const userWantToFollow = await UserModel.findById(currentUserId);
  if (followedUser.followers.includes(currentUserId)) {
    return next(new AppError("You have already followed this person", 401));
  }
  await followedUser.updateOne({ $push: { followers: currentUserId } });
  await userWantToFollow.updateOne({ $push: { followings: idUserfollowed } });
  res.status(200).json({
    status: "success",
  });
});

export const unfollowerUser = catchAsync(async (req, res, next) => {
  const idUserUnfollowed = req.params.id;
  const currentUserId = req.user.id;
  if (idUserUnfollowed === currentUserId)
    return next(new AppError("You cannot unfollow yourself", 400));
  const unfollowedUser = await UserModel.findById(idUserUnfollowed);
  if (!unfollowedUser) return next(new AppError("There is no such user", 400));
  const userWantToUnFollow = await UserModel.findById(currentUserId);
  if (!unfollowedUser.followers.includes(currentUserId)) {
    return next(new AppError("You have already unfollowed this person", 401));
  }
  await unfollowedUser.updateOne({ $pull: { followers: currentUserId } });
  await userWantToUnFollow.updateOne({
    $pull: { followings: idUserUnfollowed },
  });
  res.status(200).json({
    status: "success",
  });
});
const filterBody = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((keyname) => {
    if (allowedFields.includes(keyname)) {
      newObj[keyname] = obj[keyname];
    }
  });
  return newObj;
};

export const updateMydata = catchAsync(async (req, res, next) => {
  const newBody = filterBody(
    req.body,
    "username",
    "lastname",
    "firstname",
    "livesin",
    "worksAt",
    "relationship",
    "coverPicture",
    "profilePicture",
    "job",
  );
//   if(req.file){
//       newBody.profilePicture = req.files[0].filename

//   }
  const newUser = await UserModel.findByIdAndUpdate(req.user.id, newBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    user: newUser,
  });
});
////Xử lí coveer và profile picture

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 404), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadInfoImages = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "coverPicture", maxCount: 1 },
]);


export const resizeInfoImages = catchAsync(async (req, res, next) => {
  if (!req.files.profilePicture && !req.files.coverPicture) return next();


  if(req.files.profilePicture){

      const profilePictureName = `user--profilePicture-${
        req.user.id
      }-${Date.now()}.jpeg`;
      await sharp(req.files.profilePicture[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .toFile(`public/img/users/${profilePictureName}`);
    req.body.profilePicture = profilePictureName;
  }
  if(req.files.coverPicture){

      const coverPictureName = `user--coverPicture-${
        req.user.id
      }-${Date.now()}.jpeg`;
      await sharp(req.files.coverPicture[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .toFile(`public/img/users/${coverPictureName}`);
    req.body.coverPicture = coverPictureName;
  }

next();
});
