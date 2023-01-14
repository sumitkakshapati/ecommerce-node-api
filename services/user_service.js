import bcrypt from "bcrypt";
import User from "../models/User.js";

const _userFields = {
    "_id": 1,
    "name": 1,
    "email": 1,
    "phone": 1,
    "address": 1
};

export async function getAllUsers(req, res, next) {
    try {
        const users = await User.find({}).select(_userFields);
        res.send({
            "success": true,
            "results": users
        });
    } catch (err) {
        res.status(400).send();
    }
}

export async function updateUser(req, res, next) {
    if (req.body.userId == req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(500).json(updatedUser);
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        res.status(401).send("You can only Update your Profile");
    }
}

export async function deleteUser(req, res, next) {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (e) {
        res.status(500).send();
    }
}
