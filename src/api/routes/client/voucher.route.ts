// Dependencies
import { Router } from "express";

// Controller
import { voucherController } from "../../controllers/client";

const router = Router();

// Routing
router.get("/", voucherController.getUserVouchers);
router.get("/:voucherCode", voucherController.getSingleVoucher);

export default router;
