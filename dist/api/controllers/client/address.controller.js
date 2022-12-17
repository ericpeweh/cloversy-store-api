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
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAllUserAddress = void 0;
// Services
const client_1 = require("../../services/client");
const utils_1 = require("../../utils");
// Types
const getAllUserAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const result = yield client_1.addressService.getAllUserAddress(userId);
        res.status(200).json({
            status: "success",
            data: { address: result.rows }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getAllUserAddress = getAllUserAddress;
const createAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const { recipient_name, contact, address, is_default, province, province_id, city, city_id, subdistrict, subdistrict_id, postal_code, label, shipping_note } = req.body;
        const addressQueryData = [
            userId,
            recipient_name,
            contact,
            address,
            is_default,
            province,
            province_id,
            city,
            city_id,
            subdistrict,
            subdistrict_id,
            postal_code,
            label,
            shipping_note
        ];
        const result = yield client_1.addressService.createAddress(addressQueryData, is_default, userId);
        res.status(200).json({
            status: "success",
            data: { newAddress: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.createAddress = createAddress;
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const { addressId } = req.params;
        const { recipient_name, contact, address, is_default, province, province_id, city, city_id, subdistrict, subdistrict_id, postal_code, label, shipping_note } = req.body;
        const updatedAddressData = {
            recipient_name,
            contact,
            address,
            is_default,
            province,
            province_id,
            city,
            city_id,
            subdistrict,
            subdistrict_id,
            postal_code,
            label,
            shipping_note
        };
        const result = yield client_1.addressService.updateAddress({
            updatedAddressData,
            addressId,
            userId
        }, is_default);
        res.status(200).json({
            status: "success",
            data: { updatedAddress: result }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.updateAddress = updateAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    try {
        if (!userId || typeof userId !== "number") {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const { addressId } = req.params;
        const result = yield client_1.addressService.deleteAddress(addressId, userId);
        res.status(200).json({
            status: "success",
            data: { deletedAddress: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.deleteAddress = deleteAddress;
