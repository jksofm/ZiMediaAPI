import UserModel from "../Models/userModel.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";
import Email from "../utils/email.js";
import { promisify } from "util";
import crypto from "crypto";

const createSendToken = (user, statusCode, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COKKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",

    httpOnly: true, // cookie cannot be modified or accessed by an actions
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const registerUser = catchAsync(async (req, res) => {
  const { username, password, firstname, lastname, email, passwordChangedAt } =
    req.body;
  const newUser = await UserModel.create({
    username,
    email,
    password,
    firstname,
    lastname,
    passwordChangedAt,
  });
  // const  newUser = new UserModel(req.body);
  // await newUser.save();
  ////Email

  ////Send Token
  await new Email(newUser).sendWelcome();
  createSendToken(newUser, 200, req, res);
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide email and password!", 404));
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) return next(new AppError("Password or Email is incorrect!", 404));
  const check = await user.checkPassword(password, user.password);
  if (!check)
    return next(new AppError("Password or Email is incorrect !", 404));

  createSendToken(user, 200, req, res);
});
export const logoutUser = catchAsync(async (req, res, next) => {
   res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
})
export const protect = catchAsync(async (req,res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } 
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access")
    );

    console.log(token)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await UserModel.findById(decoded.id);
  if (!user) return next(new AppError("User not  found ! Please log again"));
 const check = await user.CheckChangedPassword(decoded.iat);
  if (check)
    return next(new AppError("Password Changed ! Please log in again"));

  req.user = user;
  // req.locals.user = user;

  next();
});

export const restrictTo = (role) => {
  return catchAsync(async (req, res, next) => {
    if (role !== req.user.role)
      return next(
        new AppError("You do not have the permission to do this action")
      );
    next();
  });
};
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return next(new AppError("User not found!", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;
    await new Email(user, resetURL).sendResetPassword();
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending Email", 500));
  }
});
export const resetPassword = catchAsync(async (req, res, next) => {
    ///Mã hóa để so sánh
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token has expired", 400));
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  user.password = req.body.password;
  await user.save();
  createSendToken(user, 200,req, res);

});
export const updatePassword = catchAsync(async (req, res, next)=>{
    const user = await UserModel.findById(req.user.id).select('+password');
    
    const check = await user.checkPassword(req.body.currentPassword,user.password);
    if(!check) return next(new AppError("Password is incorrect! Please try again"))
    user.password = req.body.newPassword;
    await user.save();
    createSendToken(user, 200,req, res);
})