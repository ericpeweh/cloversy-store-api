// Dependencies
import { Router } from "express";

// Controller
import { voucherController } from "../controllers";

const router = Router();

// Routing
router.get("/", voucherController.getAllVouchers);
router.get("/:voucherCode", voucherController.getSingleVoucher);
router.post("/", voucherController.createVoucher);
router.put("/:voucherCode", voucherController.updateVoucher);

export default router;
