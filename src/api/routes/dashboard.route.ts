// Dependencies
import { Router } from "express";

// Controller
import { dashboardController } from "../controllers";

// Validations
import validate from "../middlewares/validate";
import { dashboardSchema } from "../validations/schemas";

const router = Router();

// Address Routing
router.get(
	"/",
	validate(dashboardSchema.getDashboardDataQuerySchema, "query"),
	dashboardController.getDashboardData
);

export default router;
