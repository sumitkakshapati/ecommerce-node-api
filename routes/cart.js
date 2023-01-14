import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as cartServices from '../services/cart_service.js';

const router = express.Router();

//Read
router.get("/cart", authenticate, cartServices.getAllCarts);


//Add To cart
router.post("/cart", authenticate, cartServices.addToCarts);

//Update by ID
router.put("/cart/:id", cartServices.updateCartsProductCount);

//Delete
router.delete("/cart/:id", cartServices.deleteCartProduct);

export default router;
