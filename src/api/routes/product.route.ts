// Dependencies
import { Router } from "express";

// Config
import upload from "../../config/uploadFile";

// Controller
import { productController } from "../controllers";

const router = Router();

// Routing
router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getSingleProductById);
router.post("/", upload.array("images", 10), productController.createProduct);
router.put("/:productId", upload.array("images", 10), productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);

export default router;
