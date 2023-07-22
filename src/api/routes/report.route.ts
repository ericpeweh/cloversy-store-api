// Dependencies
import { Router } from "express";

// Controller
import { reportController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { reportSchema } from "../validations/schemas";

// Routing
router.get(
	"/sales",
	validate(reportSchema.getSalesReportQuerySchema, "query"),
	reportController.getSalesReport
);

export default router;
