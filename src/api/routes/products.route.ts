// Dependencies
import { Router } from "express";

// Config
import upload from "../../config/uploadFile";

// Controller
import { productsController } from "../controllers";

const router = Router();

// Routing
router.get("/", productsController.getAllProducts);
router.get("/:productId", productsController.getSingleProductById);
router.post("/", upload.array("images", 10), productsController.createProduct);
router.put("/:productId", upload.array("images", 10), productsController.updateProduct);
router.delete("/:productId", productsController.deleteProduct);

export default router;
