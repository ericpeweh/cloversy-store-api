// Dependencies
import { Router } from "express";

// Controller
import { voucherController } from "../controllers";

const router = Router();

// Routing
router.post("/", voucherController.createVoucher);

export default router;
