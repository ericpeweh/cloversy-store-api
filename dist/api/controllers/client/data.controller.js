"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShippingCostBySubdistrict = exports.getSubdistrictByCityId = exports.getCitiesByProvinceId = exports.getAllProvinces = void 0;
// Services
const client_1 = require("../../services/client");
const utils_1 = require("../../utils");
const getAllProvinces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provinces = yield client_1.dataService.getAllProvinces();
        res.status(200).json({
            status: "success",
            data: {
                provinces
            }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getAllProvinces = getAllProvinces;
const getCitiesByProvinceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { province: provinceId } = req.query;
    try {
        if (typeof provinceId !== "string") {
            throw new utils_1.ErrorObj.ClientError("Invalid province id");
        }
        const cities = yield client_1.dataService.getCitiesByProvinceId(provinceId);
        res.status(200).json({
            status: "success",
            data: {
                cities
            }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getCitiesByProvinceId = getCitiesByProvinceId;
const getSubdistrictByCityId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city: cityId } = req.query;
    try {
        if (typeof cityId !== "string") {
            throw new utils_1.ErrorObj.ClientError("Invalid city id");
        }
        const subdistricts = yield client_1.dataService.getSubdistrictByCityId(cityId);
        res.status(200).json({
            status: "success",
            data: {
                subdistricts
            }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getSubdistrictByCityId = getSubdistrictByCityId;
const getShippingCostBySubdistrict = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { addressId } = req.body;
    try {
        if (isNaN(+addressId)) {
            throw new utils_1.ErrorObj.ClientError("Invalid address id");
        }
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const subdistrictId = (yield client_1.addressService.getSingleUserAddress(userId, addressId))
            .subdistrict_id;
        if (!subdistrictId) {
            throw new utils_1.ErrorObj.ClientError("Address not found", 404);
        }
        const result = yield client_1.dataService.getShippingCostBySubdistrict(subdistrictId);
        res.status(200).json({
            status: "success",
            data: {
                costs: result
            }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getShippingCostBySubdistrict = getShippingCostBySubdistrict;
