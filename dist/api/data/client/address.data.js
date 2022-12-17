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
exports.getAddressById = exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getSingleUserAddress = exports.getAllUserAddress = void 0;
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
// Utils
const generateUpdateQuery_1 = __importDefault(require("../../utils/generateUpdateQuery"));
const getAllUserAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const addressQuery = `SELECT * FROM address
    WHERE user_id = $1
    ORDER BY is_default DESC, id ASC
  `;
    const addressResult = yield connectDB_1.default.query(addressQuery, [userId]);
    return addressResult;
});
exports.getAllUserAddress = getAllUserAddress;
const getSingleUserAddress = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const addressQuery = `SELECT * FROM address
    WHERE id = $1
    ORDER BY is_default DESC, id ASC
  `;
    const addressResult = yield connectDB_1.default.query(addressQuery, [addressId]);
    return addressResult;
});
exports.getSingleUserAddress = getSingleUserAddress;
const createAddress = (addressData, isDefault, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (isDefault) {
        const setDefaultQuery = `UPDATE address SET is_default = false WHERE user_id = $1`;
        yield connectDB_1.default.query(setDefaultQuery, [userId]);
    }
    const query = `INSERT INTO address(
    user_id,
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
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
    const result = yield connectDB_1.default.query(query, addressData);
    return result;
});
exports.createAddress = createAddress;
const updateAddress = (updateProductData, isDefault) => __awaiter(void 0, void 0, void 0, function* () {
    const { updatedAddressData, addressId, userId } = updateProductData;
    if (isDefault) {
        const setDefaultQuery = `UPDATE address SET is_default = false WHERE user_id = $1`;
        yield connectDB_1.default.query(setDefaultQuery, [userId]);
    }
    const { query: addressQuery, params: productParams } = (0, generateUpdateQuery_1.default)("address", updatedAddressData, { id: addressId, user_id: userId }, ` RETURNING *`);
    const addressResult = yield connectDB_1.default.query(addressQuery, productParams);
    return addressResult;
});
exports.updateAddress = updateAddress;
const deleteAddress = (addressId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM address
    WHERE id = $1 AND user_id = $2 RETURNING *`;
    const result = yield connectDB_1.default.query(query, [addressId, userId]);
    return result;
});
exports.deleteAddress = deleteAddress;
const getAddressById = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const addressQuery = `SELECT * FROM address WHERE id = $1`;
    const addressResult = yield connectDB_1.default.query(addressQuery, [addressId]);
    return addressResult;
});
exports.getAddressById = getAddressById;
