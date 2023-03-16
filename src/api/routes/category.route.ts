// Dependencies
import { Router } from "express";

// Controller
import { categoryController } from "../controllers";

// Validations
import validate from "../middlewares/validate";
import { categorySchema } from "../validations/schemas";

const router = Router();

// Routing
router.get(
	"/",
	validate(categorySchema.getAllCategoriesQuerySchema, "query"),
	categoryController.getAllCategories
);

router.post(
	"/",
	validate(categorySchema.createCategoryBodySchema, "body"),
	categoryController.createCategory
);

router.put(
	"/:categoryId",
	validate(categorySchema.updateCategoryParamsSchema, "params"),
	validate(categorySchema.updateCategoryBodySchema, "body"),
	categoryController.updateCategory
);

router.delete(
	"/:categoryId",
	validate(categorySchema.deleteCategoryParamsSchema, "params"),
	categoryController.deleteCategory
);

export default router;
