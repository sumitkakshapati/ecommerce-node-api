import express from "express";
import * as  authServices from '../services/auth_service.js';

const router = express.Router();

//Create User
router.post("/register", authServices.registerUser);

router.post("/login", authServices.loginUser);

export default router;
