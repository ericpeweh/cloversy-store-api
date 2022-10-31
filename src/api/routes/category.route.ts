// Dependencies
import { Router } from "express";

// Controller
import {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory
} from "../controllers/category.controller";

const router = Router();

// Routing
router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:categoryId", updateCategory);
router.delete("/:categoryId", deleteCategory);

export default router;
