import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
// import connectDB from "./config/db/index"
import connectDB from "./config/db/index.js";
import dotenv from "dotenv";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import CommentRoute from "./Routes/CommentRoute.js";
import {fileURLToPath} from 'url';
import MessageRoute from "./Routes/MessageRoute.js";
import globalHandlerError from "./Controllers/ErrorController.js";
import AppError from "./utils/AppError.js";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser"
import {Server} from "socket.io"



const app = express();
app.enable('trust proxy');
app.use(cors());
// app.use(cors({
//   origin : "https://www.natours.com"
// }))

app.options('*',cors());
app.use(express.static("public"))
app.use('/img', express.static('public'))


///midlware
dotenv.config();

//Body parser data
app.use(
  express.json({
    limit: "10kb",
    extended: true,
  })
  );
  //POST method
  app.use(
    express.urlencoded({
      extended: true,
      limit: "10kb",
    })
    );
    app.use(cookieParser());
connectDB();
// app.use(bodyParser.json({ extended: true,limit: "30mb"}))
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, 'public')));

/// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

////Connect Database
//Router
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/user",UserRoute);
app.use("/api/v1/post",PostRoute);
app.use("/api/v1/chat",ChatRoute);
app.use("/api/v1/message",MessageRoute);
app.use("/api/v1/comment",CommentRoute);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(__dirname));
// app.get("/*", function(req, res) {
//   res.sendFile(path.join(__dirname, "index.html"));
// });






app.all("*",function(req,res,next){
next(new AppError(`Cannot find ${req.originalUrl}. Please try again later!`,401));
})
app.use(globalHandlerError)







const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


let activeUsers = [];

const io = new Server(server, {
  cors: {
    origin: "https://zimedia.netlify.app",
  },
});

io.on("connection", (socket) => {
  ///add new user
socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Conntected Users", activeUsers);
    
    io.emit("get-users", activeUsers);
  });
  
  //send message
  socket.on("send-message",(data)=>{
      const {receiverId} = data;
      const userReceive = activeUsers.find((user)=>user.userId === receiverId)
      console.log("Sending from socket to : ",receiverId)
      console.log("Data",data)
      if(userReceive){
        io.to(userReceive.socketId).emit("receive-message",data);
      }
  })

  socket.on("send-comment",(data)=>{
     const {postId} = data;
     if(postId){
      console.log(data)
      io.emit(`receive-comment-from-${postId}`,data)
     }
  })

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("user disconnected!");
    io.emit("get-users", activeUsers);
  });
});