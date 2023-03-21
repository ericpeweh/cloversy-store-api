// Dependencies
import { Router } from "express";

// Config
import upload from "../../config/uploadFile";

// Controller
import { productController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { productSchema } from "../validations/schemas";

// Routing
router.get(
	"/",
	validate(productSchema.getNotifMarketingsQuerySchema, "query"),
	productController.getAllProducts
);

router.get(
	"/:productId",
	validate(productSchema.getSingleProductByIdParamsSchema, "params"),
	validate(productSchema.getSingleProductByIdQuerySchema, "query"),
	productController.getSingleProductById
);

router.post(
	"/",
	upload.array("images", 10),
	validate(productSchema.createProductBodySchema, "body"),
	validate(productSchema.createProductRequestSchema, ""),
	productController.createProduct
);

router.put(
	"/:productId",
	upload.array("images", 10),
	validate(productSchema.updateProductParamsSchema, "params"),
	validate(productSchema.updateProductRequestSchema, ""),
	validate(productSchema.updateProductBodySchema, "body"),
	productController.updateProduct
);

router.delete(
	"/:productId",
	validate(productSchema.deleteProductParamsSchema, "params"),
	productController.deleteProduct
);

export default router;
