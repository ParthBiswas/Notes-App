import express from 'express';
import { getMe, loginOtpController, loginVerifyController, logoutController, OtpController,  verifyController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const routers = express.Router();


routers.get("/me", authMiddleware ,getMe);

routers.post('/signup/send',OtpController);
routers.post('/signup/verify',verifyController);

routers.post('/login/send', loginOtpController);
routers.post('/login/verify',loginVerifyController);

routers.post("/logout", logoutController);

export default routers;