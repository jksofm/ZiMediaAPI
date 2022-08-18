import express from "express";
import {registerUser,loginUser,forgotPassword,resetPassword, updatePassword, protect,logoutUser} from "../Controllers/AuthController.js"
const router =express.Router();


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/forgetpassword', forgotPassword)
router.post('/resetpassword/:token', resetPassword)
router.post('/updatepassword',protect,updatePassword)
router.get('/logout',logoutUser)







export default router