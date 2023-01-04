// Dependencies
import { Router } from "express";

// Controller
import { reviewController } from "../controllers";

const router = Router();

// Routing
router.get("/", reviewController.getAllReviews);
router.get("/:transactionId", reviewController.getTransactionReviews);

export default router;
