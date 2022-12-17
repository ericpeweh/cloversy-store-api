"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// Routing
router.get("/", controllers_1.categoryController.getAllCategories);
router.post("/", controllers_1.categoryController.createCategory);
router.put("/:categoryId", controllers_1.categoryController.updateCategory);
router.delete("/:categoryId", controllers_1.categoryController.deleteCategory);
exports.default = router;
