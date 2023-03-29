// Dependencies
import { Router } from "express";

// Controller
import { dataController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { dataSchema } from "../../validations/schemas";

// Routing
router.get("/province", dataController.getAllProvinces);

router.get(
	"/city",
	validate(dataSchema.getCitiesByProvinceIdQuerySchema, "query"),
	dataController.getCitiesByProvinceId
);

router.get(
	"/subdistrict",
	validate(dataSchema.getSubdistrictByCityIdQuerySchema, "query"),
	dataController.getSubdistrictByCityId
);

router.post(
	"/cost",
	validate(dataSchema.getShippingCostBySubdistrictBodySchema, "body"),
	dataController.getShippingCostBySubdistrict
);

export default router;
