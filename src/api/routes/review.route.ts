// Dependencies
import { Router } from "express";

// Controller
import { reviewController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { reviewSchema } from "../validations/schemas";

// Routing
router.get(
	"/",
	validate(reviewSchema.getAllReviewsQuerySchema, "query"),
	reviewController.getAllReviews
);

router.get(
	"/:reviewId",
	validate(reviewSchema.getSingleReviewParamsSchema, "params"),
	reviewController.getSingleReview
);

router.put(
	"/:reviewId",
	validate(reviewSchema.updateReviewParamsSchema, "params"),
	validate(reviewSchema.updateReviewBodySchema, "body"),
	reviewController.updateReview
);

export default router;
