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
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getAllBrands = void 0;
// Config
const connectDB_1 = __importDefault(require("../../config/connectDB"));
const getAllBrands = (page, searchQuery, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    let paramsIndex = 0;
    const params = [];
    const limit = 10;
    const offset = parseInt(page) * limit - limit;
    let query = `SELECT *,
    (SELECT 
      COUNT(*) FROM product p
      WHERE p.brand_id = b.id
    ) AS product_amount  
    FROM brand b`;
    let totalQuery = `SELECT COUNT(id) FROM brand`;
    if (searchQuery) {
        query += ` WHERE name iLIKE $${paramsIndex + 1}`;
        totalQuery += ` WHERE name iLIKE $1`;
        paramsIndex += 1;
        params.push(`%${searchQuery}%`);
    }
    if (sortBy) {
        const sorter = sortBy === "a-z" || sortBy === "z-a" ? "name" : sortBy;
        const sortType = sortBy === "a-z" ? "ASC" : "DESC";
        query += ` ORDER BY ${sorter} ${sortType}`;
    }
    if (page) {
        query += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    const brands = yield connectDB_1.default.query(query, params);
    const totalResult = yield connectDB_1.default.query(totalQuery, params);
    const totalBrands = totalResult.rows[0].count;
    return {
        brands,
        page: parseInt(page) || "all",
        pageSize: brands.rowCount,
        totalCount: parseInt(totalBrands),
        totalPages: Math.ceil(totalBrands / limit)
    };
});
exports.getAllBrands = getAllBrands;
const createBrand = (brandData) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO brand(
    name,
    identifier
  ) VALUES ($1, $2) RETURNING *`;
    const result = yield connectDB_1.default.query(query, brandData);
    return result;
});
exports.createBrand = createBrand;
const updateBrand = (updatedBrand, brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE brand
    SET name = $1,  
    identifier = $2
    WHERE id = $3 RETURNING *`;
    const result = yield connectDB_1.default.query(query, [...updatedBrand, brandId]);
    return result;
});
exports.updateBrand = updateBrand;
const deleteBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM brand
    WHERE id = $1 RETURNING *`;
    const result = yield connectDB_1.default.query(query, [brandId]);
    return result;
});
exports.deleteBrand = deleteBrand;
