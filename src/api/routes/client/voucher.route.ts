// Dependencies
import { Router } from "express";

// Controller
import { voucherController } from "../../controllers/client";

const router = Router();

// Validations
import validate from "../../middlewares/validate";
import { voucherSchema } from "../../validations/schemas";

// Routing
router.get("/", voucherController.getUserVouchers);

router.post(
	"/:voucherCode",
	validate(voucherSchema.getSingleVoucherParamsSchema, "params"),
	voucherController.getSingleVoucher
);

export default router;
