import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
      chatId :{
        type: mongoose.Schema.ObjectId,
        ref : "Chat",
        required : [true,"Message must belong to a Room Chat"]
      },
      senderId:{
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required : [true,"Message must belong to a user"]
      },
      text:{
        type : String
      }
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message",MessageSchema);
export default MessageModel;
