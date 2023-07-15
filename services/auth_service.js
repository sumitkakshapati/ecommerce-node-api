import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateWebToken } from "../middleware/jwt.js";
import https from 'https';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

const router = express.Router()

export async function registerUser(req, res, next) {
    try {
        console.log(req.body);

        const doesEmailExist = await User.findOne({
            email: req.body.email,
        });
        if (doesEmailExist) {
            res.status(400).json({ success: false, message: "Email already exists" });
            return;
        }

        const doesPhoneExist = await User.findOne({
            phone: req.body.phone,
        });
        if (doesPhoneExist) {
            res.status(400).json({ success: false, message: "Phone already exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
            phone: req.body.phone,
            address: req.body.address,
        });
        if (req.file) {
            const currentDateTime = Date.now();
            const storage = getStorage();
            const storageRef = ref(storage, `files/${req.file.originalname + "       " + currentDateTime}`);
            const metadata = {
                contentType: req.file.mimetype,
            };

            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);
            newUser.profile = downloadURL
        }
        const user = await newUser.save();
        res.status(201).json({
            "message": "Registered successfully",
            "success": true
        });
    } catch (err) {
        res.status(400).json({ success: false, message: "Unable to register user", error: err });
    }
}

export async function loginUser(req, res, next) {
    try {
        console.log(req.body);
        const doesUserExist = await User.findOne({
            email: req.body.email,
        }).select({ "password": 1 });
        if (!doesUserExist) {
            res.status(400).json({ success: false, message: "Email doesnot exist" });
            return;
        }
        const validate = await bcrypt.compare(req.body.password, doesUserExist.password);
        if (!validate) {
            res.status(422).json({ success: false, message: "Incorrect password" });
            return;
        }
        const user = await User.findOne({
            email: req.body.email,
        }).select({
            "_id": 1,
            "name": 1,
            "email": 1,
            "phone": 1,
            "profile": 1,
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

export async function facebookLoginUser(req, res, next) {
    try {
        console.log(req.body);
        facebookAuthenticate(req.body.token).then((response) => {
            req.body.facebook = JSON.parse(response);
            if (req.body.facebook && !req.body.facebook.email)
                req.body.facebook.email = `${req.body.facebook.id}@facebook.com`;
            if (req.body.facebook && req.body.facebook.error) {
                res.status(400).json({ "success": false, "results": "Token is invalid" })
            }
            socialLogin(req.body.facebook.email, req.body.facebook.name, res);
        },).catch((err) => {
            res.status(500).json(err);
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

export async function googleLoginUser(req, res, next) {
    try {
        console.log(req.body);
        googleAuthenticate(req.body.token).then((response) => {
            req.body.google = JSON.parse(response);
            if (req.body.google && req.body.google.error) {
                res.status(400).json({ "success": false, "results": "Token is invalid" })
            }
            socialLogin(req.body.google.email, req.body.google.name, res);
        },).catch((err) => {
            res.status(500).json(err);
        })
    } catch (err) {
        res.status(500).json(err);
    }
}


async function socialLogin(email, fullName, res) {
    const doesUserExist = await User.findOne({ email: email }).select({
        "_id": 1,
        "name": 1,
        "email": 1,
        "phone": 1,
        "address": 1
    });
    let _tokenData;
    let user;
    if (!doesUserExist) {
        const newUser = new User({
            name: fullName,
            email: email,
            password: "",
            phone: "",
            address: "",
        });
        const localUser = await newUser.save();
        _tokenData = {
            _id: localUser._id,
            name: localUser.name,
            email: localUser.email,
            phone: localUser.phone
        };
        user = {
            _id: localUser._id,
            name: localUser.name,
            email: localUser.email,
            phone: localUser.phone,
            address: localUser.address,
        };
    } else {
        _tokenData = {
            _id: doesUserExist._id,
            name: doesUserExist.name,
            email: doesUserExist.email,
            phone: doesUserExist.phone
        }
        user = {
            _id: doesUserExist._id,
            name: doesUserExist.name,
            email: doesUserExist.email,
            phone: doesUserExist.phone,
            address: doesUserExist.address,
        };
    }

    const token = await generateWebToken(_tokenData);

    const _response = {
        "success": true,
        "results": user,
        "token": token
    }
    res.status(200).json(_response);
}

/**
 * Google authenticate.
 *
 * @returns {Promise}
 * @param {String} token
 */
export function googleAuthenticate(token) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'www.googleapis.com',
            port: null,
            path: '/oauth2/v2/userinfo',
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const req = https.request(options, function (res) {
            const chunks = [];

            res.on('data', function (chunk) {
                chunks.push(chunk);
            });

            res.on('end', function () {
                const body = Buffer.concat(chunks);

                resolve(body.toString());
            });
            req.on('error', (error) => {
                logger.error(error.message);
                reject(error);
            });
        });

        req.end();
    });
}

/**
 * Facebook authenticate.
 *
 * @returns {Promise}
 * @param {String} token
 */
export function facebookAuthenticate(token) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: 'graph.facebook.com',
            port: null,
            path: `/v2.12/me?fields=name,first_name,last_name,email&access_token=${token}`
        };

        const req = https.request(options, function (res) {
            const chunks = [];

            res.on('data', function (chunk) {
                chunks.push(chunk);
            });

            res.on('end', function () {
                const body = Buffer.concat(chunks);

                resolve(body.toString());
            });

            req.on('error', (error) => {
                logger.error(error.message);
                reject(error);
            });
        });

        req.end();
    });
}