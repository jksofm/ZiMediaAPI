import express from "express";
import { protect } from "../Controllers/AuthController.js";
import { addMessage, getMessage } from "../Controllers/MessageController.js";
const router = express.Router();


router.post("/add",protect,addMessage)
router.get("/:chatId",protect,getMessage)
export default router