import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as productService from '../services/product_service.js';
import { productUpdateValidator, productValidator } from '../validators/product_validator.js';
const router = express.Router();

//Create
router.post("/products/create", authenticate, productValidator, productService.createProduct);

//Read
router.get("/products", authenticate, productService.getAllProducts);

//Get Single Products
router.get("/products/:id", authenticate, productService.getSingleProduct);

//Update
router.put("/products/:id", authenticate, productUpdateValidator, productService.updateSingleProduct);

//Delete
router.delete('/products/:id', authenticate, productService.deleteSingleProducts);

export default router;
