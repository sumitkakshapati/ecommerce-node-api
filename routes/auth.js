import express from "express";
import * as  authServices from '../services/auth_service.js';
import { authLoginValidator, authRegisterValidator, authSocialLoginValidator } from "../validators/auth_validator.js";

const router = express.Router();

//Create User
router.post("/register", authRegisterValidator, authServices.registerUser);

router.post("/login", authLoginValidator, authServices.loginUser);

router.post("/login/social/google", authSocialLoginValidator, authServices.googleLoginUser);

export default router;
