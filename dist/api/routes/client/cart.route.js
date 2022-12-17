"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const client_1 = require("../../controllers/client");
const router = (0, express_1.Router)();
// Address Routing
router.get("/", client_1.cartController.getCartItems);
router.post("/add", client_1.cartController.addProductToCart);
router.patch("/update", client_1.cartController.updateCartItem);
router.delete("/remove", client_1.cartController.deleteCartItem);
router.post("/sync", client_1.cartController.syncCartItems);
router.delete("/sync", client_1.cartController.clearSessionCart);
exports.default = router;
