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
exports.getSingleVoucher = exports.getUserVouchers = void 0;
// Services
const client_1 = require("../../services/client");
const utils_1 = require("../../utils");
// Types
const getUserVouchers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const result = yield client_1.voucherService.getUserVouchers(userId);
        res.status(200).json({
            status: "success",
            data: { vouchers: result.rows }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getUserVouchers = getUserVouchers;
const getSingleVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { voucherCode } = req.params;
    try {
        if (typeof voucherCode !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'voucherCode' has to be type of string");
        }
        if ((voucherCode === null || voucherCode === void 0 ? void 0 : voucherCode.length) !== 10)
            throw new utils_1.ErrorObj.ClientError("Invalid voucher code!");
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const result = yield client_1.voucherService.getSingleVoucher(voucherCode, userId);
        res.status(200).json({
            status: "success",
            data: { voucher: result }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getSingleVoucher = getSingleVoucher;
