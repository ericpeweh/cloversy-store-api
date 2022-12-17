"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// Routing
router.get("/", controllers_1.voucherController.getAllVouchers);
router.get("/:voucherCode", controllers_1.voucherController.getSingleVoucher);
router.post("/", controllers_1.voucherController.createVoucher);
router.put("/:voucherCode", controllers_1.voucherController.updateVoucher);
exports.default = router;
