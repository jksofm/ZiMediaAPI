import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required : [true,"Post must belong to a user"]
    },
    content : {
        type : String,
        required : [true, "Post must have a description"]
    },
     postId : {
        type: mongoose.Schema.ObjectId,
        ref : "Post",
        required : [true,"Comment must belong to a user"]
     }



}, {
     timestamps: true 
    })
CommentSchema.pre("save",function(next){
    this.populate({
        path : "userId",
        select : "username"
    })
    next();
})

CommentSchema.pre(/^find/,function(next){
    this.populate({
        path : "userId",
        select : "username"
    })
    next();
})

const CommentModel = mongoose.model("Comment",CommentSchema);
export default CommentModel;