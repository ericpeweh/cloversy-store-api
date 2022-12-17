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
// Services
const services_1 = require("../services");
const utils_1 = require("../utils");
// Types
const getAllVouchers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status: voucherStatus = "", sortBy = "" } = req.query;
    try {
        if (typeof voucherStatus !== "string" || typeof sortBy !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'status' and 'sortBy' has to be type of string");
        }
        if (!["current_usage", "latest", "expiry_date", "id", ""].includes(sortBy)) {
            throw new utils_1.ErrorObj.ClientError("Query param 'sortBy' is not supported");
        }
        const result = yield services_1.voucherService.getAllVouchers(voucherStatus, sortBy);
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
exports.getAllVouchers = getAllVouchers;
const getSingleVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { voucherCode } = req.params;
    try {
        if (typeof voucherCode !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'voucherCode' has to be type of string");
        }
        const result = yield services_1.voucherService.getSingleVoucher(voucherCode);
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
const createVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, title, expiry_date = null, status, discount, discount_type, voucher_scope, description, selectedUserIds = [] } = req.body;
        const voucherQueryData = [
            code,
            title,
            expiry_date,
            discount,
            discount_type,
            status,
            voucher_scope,
            description
        ];
        const result = yield services_1.voucherService.createVoucher(voucherQueryData, selectedUserIds);
        res.status(200).json({
            status: "success",
            data: { newVoucher: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.createVoucher = createVoucher;
const updateVoucher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { voucherCode } = req.params;
    try {
        const { title, status, expiry_date, discount, discount_type, voucher_scope, description, selectedUserIds = [], removedUserIds = [] } = req.body;
        const voucherQueryData = [
            title,
            expiry_date,
            discount,
            discount_type,
            status,
            voucher_scope,
            description
        ];
        const result = yield services_1.voucherService.updateVoucher(voucherQueryData, selectedUserIds, removedUserIds, voucherCode);
        res.status(200).json({
            status: "success",
            data: { updatedVoucher: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.updateVoucher = updateVoucher;
