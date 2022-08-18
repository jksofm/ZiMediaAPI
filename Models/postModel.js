import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required : [true,"Post must belong to a user"]
    },
    desc : {
        type : String,
        required : [true, "Post must have a description"]
    },
    likes : [
        {
        type: mongoose.Schema.ObjectId,
        ref : "User",
        required : [true,"Like must belong to a user"]
    }
],
    image: String,



}, {
     timestamps: true 
    })
PostSchema.pre("save",function(next){
    this.populate({
        path : "userId",
        select : "username"
    })
    next();
})

// PostSchema.pre(/^find/,function(next){
//     this.populate({
//         path : "userId",
//         select : "name"
//     })
// })

const PostModel = mongoose.model("Post",PostSchema);
export default PostModel;