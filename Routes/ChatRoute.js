import express from "express";
import { createChat,getUserChat,findChat } from "../Controllers/ChatController.js";
import {protect} from "../Controllers/AuthController.js";
const router = express.Router();


router.post("/",protect,createChat);
router.get("/",protect,getUserChat);
router.get("/find/:firstId/:secondId",protect,findChat)

export default router;