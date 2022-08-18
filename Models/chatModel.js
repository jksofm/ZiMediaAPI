import mongoose from "mongoose";

const ChatSchema = mongoose.Schema(
  {
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref : "User",
            required : [true,"Chat must have user"]
        }
    ]
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat",ChatSchema);
export default ChatModel;
