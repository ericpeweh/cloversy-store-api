// Dependencies
import { Router } from "express";

// Controller
import { categoryController } from "../controllers";

const router = Router();

// Routing
router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);
router.put("/:categoryId", categoryController.updateCategory);
router.delete("/:categoryId", categoryController.deleteCategory);

export default router;
