import User from '../models/User.js';
import { decodeWebToken } from './jwt.js';

export async function authenticate(req, res, next) {
    try {
        const _authorization = req.headers['Authorization'] ?? req.headers['authorization'];
        const _token = _authorization.split(" ")[1];
        const _decodedData = await decodeWebToken(_token);
        const _user = await User.findOne({ email: _decodedData["email"] }).select({
            "_id": 1,
            "name": 1,
            "email": 1,
            "phone": 1,
            "isAdmin": 1,
            "address": 1
        });
        if (!_user) {
            return res.status(401).json({ message: 'Unauthorized Access - No Token Provided!', success: false });
        } else {
            req.user = _user.toJSON();
            next();
        }
    } catch (e) {
        return res.status(401).json({ message: 'Unauthorized Access - No Token Provided!', success: false });
    }
};
