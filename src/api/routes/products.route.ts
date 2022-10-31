// Dependencies
import { Router } from "express";

// Controller
import { getAllProducts, createProduct } from "../controllers/products.controller";

const router = Router();

// Routing
router.get("/", getAllProducts);
router.post("/", createProduct);

export default router;
