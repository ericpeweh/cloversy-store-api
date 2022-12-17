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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleVoucher = exports.getUserVouchers = void 0;
// Data
const client_1 = require("../../data/client");
// Utils
const utils_1 = require("../../utils");
const isDateSurpassToday_1 = __importDefault(require("../../utils/isDateSurpassToday"));
const getUserVouchers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vouchers = yield client_1.voucherRepo.getUserVouchers(userId);
        return vouchers;
    }
    catch (error) {
        throw error;
    }
});
exports.getUserVouchers = getUserVouchers;
const getSingleVoucher = (voucherCode, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { voucherResult, selectedUsers } = yield client_1.voucherRepo.getSingleVoucher(voucherCode.toUpperCase());
        const isVoucherUserScoped = selectedUsers.length > 0;
        const voucher = voucherResult.rows[0];
        if (isVoucherUserScoped) {
            const isUserIncluded = selectedUsers.findIndex(user => user.user_id === userId) !== -1;
            if (!isUserIncluded)
                throw new utils_1.ErrorObj.ClientError("You're not authorized to use this voucher!", 403);
        }
        if (voucher.status !== "active") {
            throw new utils_1.ErrorObj.ClientError("Voucher is no longer available.");
        }
        if ((0, isDateSurpassToday_1.default)(voucher.expiry_date)) {
            throw new utils_1.ErrorObj.ClientError("Voucher is expired.");
        }
        if (voucher.current_usage >= voucher.usage_limit) {
            throw new utils_1.ErrorObj.ClientError("Voucher usage limit has been reached.");
        }
        return voucher;
    }
    catch (error) {
        throw error;
    }
});
exports.getSingleVoucher = getSingleVoucher;
