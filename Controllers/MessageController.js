import MessageModel from "../Models/MessageModel.js";
import catchAsync from "../utils/catchAsync.js";
import mongoose from "mongoose";

export const addMessage = catchAsync(async(req,res,next)=>{
   const {chatId,text} = req.body;
   const newMessage = new MessageModel({
      chatId,
      text,
      senderId : req.user.id
   })
   const result = await newMessage.save();

   res.json({
    state : "success",
    result
   })
})
export const getMessage = catchAsync(async(req,res,next)=>{
    console.log("Chat Id",req.params.chatId)
   
     const message = await MessageModel.find({chatId: req.params.chatId})
     res.status(200).json({
        state : "success",
        result : message
     })
})