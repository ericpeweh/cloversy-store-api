"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const client_1 = require("../../controllers/client");
const router = (0, express_1.Router)();
// Routing
router.post("/", client_1.transactionController.createTransaction);
router.get("/", client_1.transactionController.getUserTransactions);
router.get("/:transactionId", client_1.transactionController.getSingleTransaction);
exports.default = router;