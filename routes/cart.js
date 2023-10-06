import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as cartServices from '../services/cart_service.js';
import { cartUpdateValidator, cartValidator } from '../validators/cart_validator.js';

const router = express.Router();

//Read
router.get("/cart", authenticate, cartServices.getAllCarts);

//Add To cart
router.post("/cart", authenticate, cartValidator, cartServices.addToCarts);

//Update by ID
router.put("/cart/:id", authenticate, cartUpdateValidator, cartServices.updateCartsProductCount);

//Delete
router.delete("/cart/:id", authenticate, cartServices.deleteCartProduct);

//Read total cart price
router.get("/cart/total", authenticate, cartServices.totalCartPrice);

//Read total cart price
router.get("/cart/count", authenticate, cartServices.countCarts);

export default router;
