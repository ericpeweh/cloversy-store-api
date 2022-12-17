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
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
// Utils
const utils_1 = require("../../utils");
const getUserVouchers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const voucherQuery = `SELECT  v.code, v.title, v.discount, v.discount_type, v.expiry_date
    FROM voucher_dist vd
    JOIN voucher v
    ON v.code = vd.voucher_code
  WHERE user_id = $1
  AND status = 'active'
  ORDER BY created_at DESC
  `;
    const voucherResult = yield connectDB_1.default.query(voucherQuery, [userId]);
    return voucherResult;
});
exports.getUserVouchers = getUserVouchers;
const getSingleVoucher = (voucherCode) => __awaiter(void 0, void 0, void 0, function* () {
    const voucherQuery = `SELECT * FROM voucher WHERE code = $1`;
    const voucherResult = yield connectDB_1.default.query(voucherQuery, [voucherCode]);
    if (voucherResult.rows.length === 0) {
        throw new utils_1.ErrorObj.ClientError("Voucher not found!", 404);
    }
    const isVoucherUserScoped = voucherResult.rows[0].voucher_scope === "user";
    let voucherDistResult = [];
    if (isVoucherUserScoped) {
        const voucherDistQuery = `SELECT u.id AS user_id, u.email AS email, 
      u.full_name AS full_name, u.profile_picture AS profile_picture
      FROM voucher_dist v
      JOIN users u
      ON v.user_id = u.id
      WHERE v.voucher_code = $1`;
        const result = yield connectDB_1.default.query(voucherDistQuery, [voucherCode]);
        voucherDistResult = result.rows;
    }
    return { voucherResult, selectedUsers: voucherDistResult };
});
exports.getSingleVoucher = getSingleVoucher;
