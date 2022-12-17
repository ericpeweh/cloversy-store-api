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
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getSingleUserAddress = exports.getAllUserAddress = void 0;
// Data
const client_1 = require("../../data/client");
// Utils
const utils_1 = require("../../utils");
const getAllUserAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const address = yield client_1.addressRepo.getAllUserAddress(userId);
    return address;
});
exports.getAllUserAddress = getAllUserAddress;
const getSingleUserAddress = (userId, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_1.addressRepo.getSingleUserAddress(addressId);
    if (result.rows.length === 0 || result.rows[0].user_id !== +userId) {
        throw new utils_1.ErrorObj.ClientError("Address not found!", 404);
    }
    return result.rows[0];
});
exports.getSingleUserAddress = getSingleUserAddress;
const createAddress = (addressData, isDefault, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newAddress = yield client_1.addressRepo.createAddress(addressData, isDefault, userId);
    return newAddress;
});
exports.createAddress = createAddress;
const updateAddress = (data, isDefault) => __awaiter(void 0, void 0, void 0, function* () {
    const { addressId, userId } = data;
    const address = yield client_1.addressRepo.getAddressById(addressId);
    if (address.rows.length === 0) {
        throw new utils_1.ErrorObj.ClientError("Address not found!", 404);
    }
    if (address.rows[0].user_id !== userId) {
        throw new utils_1.ErrorObj.ClientError("Not authorized!", 403);
    }
    const addressResult = yield client_1.addressRepo.updateAddress(data, isDefault);
    return addressResult;
});
exports.updateAddress = updateAddress;
const deleteAddress = (addressId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const address = yield client_1.addressRepo.getAddressById(addressId);
    if (address.rows.length === 0) {
        throw new utils_1.ErrorObj.ClientError("Address not found!", 404);
    }
    if (address.rows[0].user_id !== userId) {
        throw new utils_1.ErrorObj.ClientError("Not authorized!", 403);
    }
    const result = yield client_1.addressRepo.deleteAddress(addressId, userId);
    return result;
});
exports.deleteAddress = deleteAddress;
