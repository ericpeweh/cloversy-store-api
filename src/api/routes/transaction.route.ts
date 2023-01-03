// Dependencies
import { Router } from "express";

// Controller
import { transactionController } from "../controllers";

const router = Router();

// Routing
router.get("/", transactionController.getTransactions);
router.get("/:transactionId", transactionController.getSingleTransaction);
router.patch("/:transactionId", transactionController.updateTransaction);
// router.post("/:transactionId/cancel", transactionController.cancelTransaction);

export default router;
