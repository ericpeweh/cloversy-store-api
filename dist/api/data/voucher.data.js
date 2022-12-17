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
exports.updateVoucher = exports.createVoucher = exports.getSingleVoucher = exports.getAllVouchers = void 0;
// Config
const connectDB_1 = __importDefault(require("../../config/connectDB"));
// Utils
const utils_1 = require("../utils");
const getAllVouchers = (voucherStatus, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    let paramsIndex = 0;
    const params = [];
    let voucherQuery = `SELECT * FROM voucher`;
    if (voucherStatus) {
        voucherQuery += ` WHERE status = $${paramsIndex + 1}`;
        params.push(voucherStatus);
        paramsIndex += 1;
    }
    if (sortBy && sortBy !== "id") {
        voucherQuery += ` ORDER BY ${sortBy} ASC`;
    }
    if (sortBy === "id") {
        voucherQuery += ` ORDER BY created_at DESC`;
    }
    const voucherResult = yield connectDB_1.default.query(voucherQuery, params);
    return voucherResult;
});
exports.getAllVouchers = getAllVouchers;
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
const createVoucher = (voucherData, selectedUserIds) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    try {
        yield client.query("BEGIN");
        const voucherQuery = `INSERT INTO voucher(
      code,
      title,
      expiry_date,
      discount,
      discount_type,
      status,
      voucher_scope,
      description
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const voucherResult = yield client.query(voucherQuery, voucherData);
        const newVoucherCode = voucherResult.rows[0].code;
        if (selectedUserIds.length > 0) {
            const voucherDistQuery = `INSERT INTO voucher_dist(
        user_id,
        voucher_code
      ) VALUES ($1, $2) RETURNING *`;
            selectedUserIds.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
                yield client.query(voucherDistQuery, [userId, newVoucherCode]);
            }));
        }
        yield client.query("COMMIT");
        return voucherResult;
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
});
exports.createVoucher = createVoucher;
const updateVoucher = (updatedVoucherData, selectedUserIds, removedUserIds, code) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    try {
        yield client.query("BEGIN");
        const voucherQuery = `UPDATE voucher SET
      title = $1,
      expiry_date = $2,
      discount = $3,
      discount_type = $4,
      status = $5,
      voucher_scope = $6,
      description = $7
      WHERE code = $8 RETURNING *`;
        const voucherResult = yield client.query(voucherQuery, [...updatedVoucherData, code]);
        const isVoucherGlobalScoped = voucherResult.rows[0].voucher_scope === "global";
        if (isVoucherGlobalScoped) {
            const voucherDistRemoveQuery = `DELETE FROM voucher_dist WHERE voucher_code = $1`;
            yield client.query(voucherDistRemoveQuery, [code]);
        }
        if (!isVoucherGlobalScoped && selectedUserIds.length > 0) {
            const voucherDistQuery = `INSERT INTO voucher_dist(
        user_id,
        voucher_code
      ) VALUES ($1, $2)`;
            selectedUserIds.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
                yield client.query(voucherDistQuery, [userId, code]);
            }));
        }
        if (!isVoucherGlobalScoped && removedUserIds.length > 0) {
            const voucherDistRemoveQuery = `DELETE FROM voucher_dist 
        WHERE user_id = $1
        AND voucher_code = $2`;
            removedUserIds.forEach((userId) => __awaiter(void 0, void 0, void 0, function* () {
                yield client.query(voucherDistRemoveQuery, [userId, code]);
            }));
        }
        yield client.query("COMMIT");
        return voucherResult;
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
});
exports.updateVoucher = updateVoucher;
