import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as userServices from '../services/user_service.js';

const router = express.Router();

//Read
router.get("/users", authenticate, userServices.getAllUsers);

//Update by ID
router.put("/users/:id", authenticate, userServices.updateUser);

//Delete
router.delete("/users/:id", authenticate, userServices.deleteUser);

export default router;
