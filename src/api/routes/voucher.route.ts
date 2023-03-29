// Dependencies
import { Router } from "express";

// Controller
import { voucherController } from "../controllers";

const router = Router();

// Validations
import validate from "../middlewares/validate";
import { voucherSchema } from "../validations/schemas";

// Routing
router.get(
	"/",
	validate(voucherSchema.getAllVouchersQuerySchema, "query"),
	voucherController.getAllVouchers
);

router.get(
	"/:voucherCode",
	validate(voucherSchema.getSingleVoucherParamsSchema, "params"),
	validate(voucherSchema.getSingleVoucherQuerySchema, "query"),
	voucherController.getSingleVoucher
);

router.post(
	"/",
	validate(voucherSchema.createVoucherBodySchema, "body"),
	voucherController.createVoucher
);

router.put(
	"/:voucherCode",
	validate(voucherSchema.updateVoucherParamsSchema, "params"),
	validate(voucherSchema.updateVoucherBodySchema, "body"),
	voucherController.updateVoucher
);

export default router;
