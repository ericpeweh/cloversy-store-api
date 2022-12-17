"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_1 = require("express");
// Controller
const client_1 = require("../../controllers/client");
const router = (0, express_1.Router)();
// Routing
router.get("/province", client_1.dataController.getAllProvinces);
router.get("/city", client_1.dataController.getCitiesByProvinceId);
router.get("/subdistrict", client_1.dataController.getSubdistrictByCityId);
router.post("/cost", client_1.dataController.getShippingCostBySubdistrict);
exports.default = router;
