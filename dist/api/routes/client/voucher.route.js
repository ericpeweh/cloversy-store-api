"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const client_1 = require("../../controllers/client");
const router = (0, express_1.Router)();
// Routing
router.get("/", client_1.voucherController.getUserVouchers);
router.post("/:voucherCode", client_1.voucherController.getSingleVoucher);
exports.default = router;