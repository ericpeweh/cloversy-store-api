// Dependencies
import { Router } from "express";

// Controller
import { brandController } from "../controllers";

// Validations
import validate from "../middlewares/validate";
import { brandSchema } from "../validations/schemas";

const router = Router();

// Routing
router.get(
	"/",
	validate(brandSchema.getAllBrandsQuerySchema, "query"),
	brandController.getAllBrands
);

router.post("/", validate(brandSchema.createBrandBodySchema, "body"), brandController.createBrand);

router.put(
	"/:brandId",
	validate(brandSchema.updateBrandParamsSchema, "params"),
	validate(brandSchema.updateBrandBodySchema, "body"),
	brandController.updateBrand
);

router.delete(
	"/:brandId",
	validate(brandSchema.deleteBrandParamsSchema, "params"),
	brandController.deleteBrand
);

export default router;
