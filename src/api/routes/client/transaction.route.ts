// Dependencies
import { Router } from "express";

// Controller
import { transactionController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { transactionSchema } from "../../validations/schemas";

// Routing
router.post(
	"/",
	validate(transactionSchema.postCreateTransactionBodySchema, "body"),
	transactionController.createTransaction
);

router.get("/", transactionController.getUserTransactions);

router.get(
	"/:transactionId",
	validate(transactionSchema.getSingleTransactionParamsSchema, "params"),
	transactionController.getSingleTransaction
);

router.post(
	"/:transactionId/cancel",
	validate(transactionSchema.cancelTransactionParamsSchema, "params"),
	transactionController.cancelTransaction
);

router.post(
	"/:transactionId/review",
	validate(transactionSchema.postReviewTransactionParamsSchema, "params"),
	validate(transactionSchema.postReviewTransactionBodySchema, "body"),
	transactionController.reviewTransaction
);

export default router;
