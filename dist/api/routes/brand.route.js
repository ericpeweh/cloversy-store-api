"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// Routing
router.get("/", controllers_1.brandController.getAllBrands);
router.post("/", controllers_1.brandController.createBrand);
router.put("/:brandId", controllers_1.brandController.updateBrand);
router.delete("/:brandId", controllers_1.brandController.deleteBrand);
exports.default = router;
