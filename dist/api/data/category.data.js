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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
// Config
const connectDB_1 = __importDefault(require("../../config/connectDB"));
const getAllCategories = (page, searchQuery, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    let paramsIndex = 0;
    const params = [];
    const limit = 10;
    const offset = parseInt(page) * limit - limit;
    let query = `SELECT *,
    (SELECT 
      COUNT(*) FROM product p 
      WHERE p.category_id = c.id
    ) AS product_amount 
    FROM category c`;
    let totalQuery = `SELECT COUNT(id) FROM category`;
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
    const categories = yield connectDB_1.default.query(query, params);
    const totalResult = yield connectDB_1.default.query(totalQuery, params);
    const totalCategory = totalResult.rows[0].count;
    return {
        categories,
        page: parseInt(page) || "all",
        pageSize: categories.rowCount,
        totalCount: parseInt(totalCategory),
        totalPages: Math.ceil(totalCategory / limit)
    };
});
exports.getAllCategories = getAllCategories;
const createCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO category(
    name,
    description,
    identifier
  ) VALUES ($1, $2, $3) RETURNING *`;
    const result = yield connectDB_1.default.query(query, categoryData);
    return result;
});
exports.createCategory = createCategory;
const updateCategory = (updatedCategory, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `UPDATE category
    SET name = $1,  
    description = $2,
    identifier = $3
    WHERE id = $4 RETURNING *`;
    const result = yield connectDB_1.default.query(query, [...updatedCategory, categoryId]);
    return result;
});
exports.updateCategory = updateCategory;
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM category
    WHERE id = $1 RETURNING *`;
    const result = yield connectDB_1.default.query(query, [categoryId]);
    return result;
});
exports.deleteCategory = deleteCategory;
