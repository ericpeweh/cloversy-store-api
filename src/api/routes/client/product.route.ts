// Dependencies
import { Router } from "express";

// Controller
import { productController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/", productController.getAllProducts);
router.get("/:productSlug", productController.getSingleProductBySlug);

export default router;
