// Dependencies
import { Router } from "express";

// Controller
import { activityController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { activitySchema } from "../../validations/schemas";

// Routing
router.get("/product-last-seen", activityController.getUserLastSeenProducts);

router.post(
	"/product-last-seen",
	validate(activitySchema.postTrackUserLastSeenProductBodySchema, "body"),
	activityController.trackUserLastSeenProduct
);

export default router;
