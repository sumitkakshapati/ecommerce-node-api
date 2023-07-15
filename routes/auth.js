import express from "express";
import * as  authServices from '../services/auth_service.js';
import { authLoginValidator, authRegisterValidator, authSocialLoginValidator } from "../validators/auth_validator.js";
import uploadImage from "../middleware/uploadImage.js";

const router = express.Router();

//Create User
router.post("/register", uploadImage.single("profile"),authRegisterValidator, authServices.registerUser);

router.post("/login", authLoginValidator, authServices.loginUser);

router.post("/login/social/google", authSocialLoginValidator, authServices.googleLoginUser);

router.post("/login/social/facebook", authSocialLoginValidator, authServices.facebookLoginUser);

export default router;
