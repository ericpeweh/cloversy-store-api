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
exports.updateVoucher = exports.createVoucher = exports.getSingleVoucher = exports.getAllVouchers = void 0;
// Data
const data_1 = require("../data");
const getAllVouchers = (voucherStatus, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vouchers = yield data_1.voucherRepo.getAllVouchers(voucherStatus, sortBy);
        return vouchers;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllVouchers = getAllVouchers;
const getSingleVoucher = (voucherCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { voucherResult, selectedUsers } = yield data_1.voucherRepo.getSingleVoucher(voucherCode);
        return selectedUsers.length > 0
            ? Object.assign(Object.assign({}, voucherResult.rows[0]), { selectedUsers }) : voucherResult.rows[0];
    }
    catch (error) {
        throw error;
    }
});
exports.getSingleVoucher = getSingleVoucher;
const createVoucher = (voucherData, selectedUserIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newVoucher = yield data_1.voucherRepo.createVoucher(voucherData, selectedUserIds);
        return newVoucher;
    }
    catch (error) {
        throw error;
    }
});
exports.createVoucher = createVoucher;
const updateVoucher = (updatedVoucherData, selectedUserIds, removedUserIds, code) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedVoucher = yield data_1.voucherRepo.updateVoucher(updatedVoucherData, selectedUserIds, removedUserIds, code);
        return updatedVoucher;
    }
    catch (error) {
        throw error;
    }
});
exports.updateVoucher = updateVoucher;
