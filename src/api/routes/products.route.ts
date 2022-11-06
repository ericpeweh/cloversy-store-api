// Dependencies
import { Router } from "express";

// Controller
import { productsController } from "../controllers";

const router = Router();

// Routing
router.get("/", productsController.getAllProducts);
router.get("/:productSlug", productsController.getSingleProduct);
router.post("/", productsController.createProduct);
router.put("/:productId", productsController.updateProduct);
router.delete("/:productId", productsController.deleteProduct);

export default router;
