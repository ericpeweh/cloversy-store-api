"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const controllers_1 = require("../controllers");
// Middlewares
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
// Routing
router.get("/", controllers_1.authController.authUser);
router.post("/resetpassword", middlewares_1.getUserData, controllers_1.authController.resetPassword);
exports.default = router;
