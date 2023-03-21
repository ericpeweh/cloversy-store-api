// Dependencies
import { Router } from "express";

// Controller
import { transactionController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { transactionSchema } from "../validations/schemas";

// Routing
router.get(
	"/",
	validate(transactionSchema.getTransactionsQuerySchema, "query"),
	transactionController.getTransactions
);

router.get(
	"/:transactionId",
	validate(transactionSchema.getSingleTransactionParamsSchema, "params"),
	validate(transactionSchema.getSingleTransactionQuerySchema, "query"),
	transactionController.getSingleTransaction
);

router.patch(
	"/:transactionId",
	validate(transactionSchema.updateTransactionParamsSchema, "params"),
	validate(transactionSchema.updateTransactionBodySchema, "body"),
	transactionController.updateTransaction
);

router.patch(
	"/:transactionId/status",
	validate(transactionSchema.patchChangeTransactionStatusParamsSchema, "params"),
	validate(transactionSchema.patchChangeTransactionStatusBodySchema, "body"),
	transactionController.changeTransactionStatus
);

export default router;
