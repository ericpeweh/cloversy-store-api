"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// Routing
router.get("/", controllers_1.userController.getAllCustomers);
router.get("/:userId", controllers_1.userController.getSingleCustomer);
router.put("/:userId", controllers_1.userController.updateUserData);
exports.default = router;
