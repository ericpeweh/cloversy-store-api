// Dependencies
import { Router } from "express";

// Controller
import { subscriptionController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { subscriptionSchema } from "../validations/schemas";

// Routing
router.get(
	"/push",
	validate(subscriptionSchema.getPushSubscriptionsQuerySchema, "query"),
	subscriptionController.getPushSubscriptions
);

export default router;
