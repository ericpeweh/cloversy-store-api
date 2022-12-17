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
exports.updateUser = exports.createNewUser = exports.getUserDataById = exports.getUserDataByEmail = exports.getUserDataBySub = exports.getAllCustomers = void 0;
// Config
const connectDB_1 = __importDefault(require("../../config/connectDB"));
// Utils
const generateUpdateQuery_1 = __importDefault(require("../utils/generateUpdateQuery"));
const getAllCustomers = (page, searchQuery, statusQuery) => __awaiter(void 0, void 0, void 0, function* () {
    let paramsIndex = 1;
    const params = ["user"];
    const limit = 12;
    const offset = parseInt(page) * limit - limit;
    let query = "SELECT * FROM users WHERE user_role = $1";
    let totalQuery = "SELECT COUNT(id) FROM users WHERE user_role = $1";
    if (searchQuery) {
        const searchPart = ` AND (email iLIKE $${paramsIndex + 1} OR full_name iLIKE $${paramsIndex + 2})`;
        query += searchPart;
        totalQuery += searchPart;
        paramsIndex += 2;
        params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }
    if (statusQuery) {
        const statusPart = ` AND user_status = $${paramsIndex + 1}`;
        query += statusPart;
        totalQuery += statusPart;
        params.push(statusQuery);
    }
    // INI buat rest api
    query += " ORDER BY id DESC";
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    const customers = yield connectDB_1.default.query(query, params);
    const totalResult = yield connectDB_1.default.query(totalQuery, params);
    const totalCustomers = totalResult.rows[0].count;
    return {
        customers,
        page: parseInt(page),
        pageSize: limit,
        totalCount: parseInt(totalCustomers),
        totalPages: Math.ceil(totalCustomers / limit)
    };
});
exports.getAllCustomers = getAllCustomers;
const getUserDataBySub = (userSub) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = "SELECT * FROM users WHERE sub = $1";
    const userResult = yield connectDB_1.default.query(userQuery, [userSub]);
    return userResult;
});
exports.getUserDataBySub = getUserDataBySub;
const getUserDataByEmail = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = yield connectDB_1.default.query(userQuery, [userEmail]);
    return userResult;
});
exports.getUserDataByEmail = getUserDataByEmail;
const getUserDataById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userResult = yield connectDB_1.default.query(userQuery, [userId]);
    const addressQuery = "SELECT * FROM address WHERE user_id = $1";
    const addressResult = yield connectDB_1.default.query(addressQuery, [userId]);
    const lastSeenQuery = `SELECT p.id, p.title 
    FROM user_last_seen uls
    JOIN product p
      ON uls.product_id = p.id
    WHERE uls.user_id = $1
  `;
    const lastSeenResult = yield connectDB_1.default.query(lastSeenQuery, [userId]);
    const wishlistQuery = "SELECT * FROM wishlist WHERE user_id = $1";
    const wishlistResult = yield connectDB_1.default.query(wishlistQuery, [userId]);
    const vouchersQuery = `SELECT v.* FROM voucher_dist vd 
    JOIN voucher v
    ON vd.voucher_code = v.code
    WHERE vd.user_id = $1
  `;
    const vouchersResult = yield connectDB_1.default.query(vouchersQuery, [userId]);
    return { userResult, addressResult, lastSeenResult, wishlistResult, vouchersResult };
});
exports.getUserDataById = getUserDataById;
const createNewUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = `INSERT INTO users(
    full_name,
    email,
    profile_picture,
    sub
  ) VALUES ($1, $2, $3, $4) RETURNING *`;
    const userResult = yield connectDB_1.default.query(userQuery, userData);
    return userResult;
});
exports.createNewUser = createNewUser;
const updateUser = (updatedUserData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, params } = (0, generateUpdateQuery_1.default)("users", updatedUserData, { id: userId }, " RETURNING *");
    const userResult = yield connectDB_1.default.query(query, params);
    return userResult;
});
exports.updateUser = updateUser;
