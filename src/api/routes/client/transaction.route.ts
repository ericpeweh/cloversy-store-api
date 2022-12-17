// Dependencies
import { Router } from "express";

// Controller
import { transactionController } from "../../controllers/client";

const router = Router();

// Routing
router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getUserTransactions);
router.get("/:transactionId", transactionController.getSingleTransaction);

export default router;
