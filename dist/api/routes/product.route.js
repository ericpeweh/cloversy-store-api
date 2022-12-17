"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Config
const uploadFile_1 = __importDefault(require("../../config/uploadFile"));
// Controller
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// Routing
router.get("/", controllers_1.productController.getAllProducts);
router.get("/:productId", controllers_1.productController.getSingleProductById);
router.post("/", uploadFile_1.default.array("images", 10), controllers_1.productController.createProduct);
router.put("/:productId", uploadFile_1.default.array("images", 10), controllers_1.productController.updateProduct);
router.delete("/:productId", controllers_1.productController.deleteProduct);
exports.default = router;
