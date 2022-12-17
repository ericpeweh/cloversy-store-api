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
exports.getAllCategories = void 0;
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    let query = `SELECT id, name,
    (SELECT 
      COUNT(*) FROM product p 
      WHERE p.category_id = c.id
    ) AS product_amount 
    FROM category c
    ORDER BY product_amount DESC`;
    const categories = yield connectDB_1.default.query(query, []);
    return {
        categories
    };
});
exports.getAllCategories = getAllCategories;
