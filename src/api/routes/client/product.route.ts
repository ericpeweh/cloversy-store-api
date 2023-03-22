// Dependencies
import { Router } from "express";

// Controller
import { productController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { productSchema } from "../../validations/schemas";

// Routing
router.get(
	"/",
	validate(productSchema.getAllProductsClientQuerySchema, "query"),
	productController.getAllProducts
);

router.get(
	"/:productSlug",
	validate(productSchema.getSingleProductBySlugParamsSchema, "params"),
	productController.getSingleProductBySlug
);

export default router;
