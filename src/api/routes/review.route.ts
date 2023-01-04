// Dependencies
import { Router } from "express";

// Controller
import { reviewController } from "../controllers";

const router = Router();

// Routing
router.get("/", reviewController.getAllReviews);
router.get("/:reviewId", reviewController.getSingleReview);
router.put("/:reviewId", reviewController.updateReview);

export default router;
