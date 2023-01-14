import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateWebToken } from "../middleware/jwt.js";

const router = express.Router()

export async function registerUser(req, res, next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
            phone: req.body.phone,
            address: req.body.address,
        });
        const user = await newUser.save();
        res.status(201).json({
            "message": "Registered successfully",
            "success": true
        });
    } catch (err) {
        res.status(400).json(err);
    }
}

export async function loginUser(req, res, next) {
    try {
        const doesUserExist = await User.findOne({
            email: req.body.email,
        }).select({ "password": 1 });
        !doesUserExist && res.status(400).json("Email doesnot exist");
        const validate = await bcrypt.compare(req.body.password, doesUserExist.password);
        !validate && res.status(422).json("Incorrect password");
        const user = await User.findOne({
            email: req.body.email,
        }).select({
            "_id": 1,
            "name": 1,
            "email": 1,
            "phone": 1,
            "address": 1
        });

        const _tokenData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
        }

        const token = await generateWebToken(_tokenData);

        const _response = {
            "success": true,
            "results": user,
            "token": token
        }
        res.status(200).json(_response);
    } catch (err) {
        res.status(500).json(err);
    }
}