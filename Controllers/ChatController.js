import ChatModel from "../Models/chatModel.js"
import catchAsync from "../utils/catchAsync.js"

export const createChat = catchAsync(async(req,res)=>{
   const newChat = new ChatModel({
    members: [req.body.senderId,req.body.receiverId]
   })
   const result = await newChat.save();
   res.status(200).json({
    status : "success",
    result
   });


})
///Tìm những Chat nào có current user
export const getUserChat = catchAsync(async(req,res)=>{
    const chat = await ChatModel.find({
        members : {$in : [req.user.id]}
    }).populate({
        path: "members",
        select : "lastname firstname profilePicture username"
    })
    res.status(200).json({
        status : "success",
        chat
    })

})


export const findChat = catchAsync(async(req,res)=>{
     const chat = await ChatModel.findOne({
        members : {$all : [req.params.firstId,req.params.secondId]}
     })
     res.status(200).json({
        status: "success",
        chat
     })
})