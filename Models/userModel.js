import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,

      required: [true, "You must have a name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "You must have a password"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    livesin: String,
    job: String,
    worksAt: String,
    relationship: String,
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required : [true,"follow must belong to a user"]
    }],
    followings: [
        {
            type: mongoose.Schema.ObjectId,
            ref : "User",
            required : [true,"follow must belong to a user"]
        }
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
);
///middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
UserSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

///methods
UserSchema.methods.checkPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};
UserSchema.methods.CheckChangedPassword = async function (JWTCurrent) {
  if (this.passwordChangedAt) {
    const changedAtTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedAtTimeStamp);
    console.log(JWTCurrent);
    return JWTCurrent < changedAtTimeStamp;
  }
};
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  /////Mã hóa token để đưa lên schema
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
