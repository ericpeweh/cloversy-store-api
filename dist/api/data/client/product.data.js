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
exports.checkProductExistById = exports.getProductsPriceRange = exports.getProductImages = exports.getProductRecommendations = exports.getSingleProductBySlug = exports.getAllProducts = void 0;
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
// Utils
const utils_1 = require("../../utils");
const getAllProducts = (page, searchQuery, sortBy, brandFilter, count, priceFilter) => __awaiter(void 0, void 0, void 0, function* () {
    let paramsIndex = 0;
    const params = [];
    const limit = parseInt(count) || 12;
    const offset = parseInt(page) * limit - limit;
    let query = `SELECT p.*, b.name AS brand, 
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.id
    ),
    (SELECT array_agg("size" ORDER BY size ASC) AS sizes
      FROM product_size ps
      WHERE ps.product_id = p.id
    ),
    (SELECT array_agg("tag") AS tags
      FROM product_tag pt
      WHERE pt.product_id = p.id
    )
    FROM product p JOIN brand b
    ON p.brand_id = b.id
    WHERE p.status = 'active'`;
    let totalQuery = "SELECT COUNT(id) FROM product WHERE status = 'active'";
    if (brandFilter) {
        const filter = ` AND brand_id = $${paramsIndex + 1}`;
        query += filter;
        totalQuery += filter;
        params.push(brandFilter);
        paramsIndex += 1;
    }
    if (searchQuery) {
        const search = ` AND title iLIKE $${paramsIndex + 1}`;
        query += search;
        totalQuery += search;
        params.push(`%${searchQuery}%`);
        paramsIndex += 1;
    }
    if (priceFilter) {
        const filter = priceFilter.split(",");
        const price = ` AND price BETWEEN $${paramsIndex + 1} AND $${paramsIndex + 2}`;
        query += price;
        totalQuery += price;
        params.push(filter[0], filter[1]);
        paramsIndex += 2;
    }
    if (sortBy) {
        const sorter = sortBy === "low-to-high" || sortBy === "high-to-low" ? "price" : sortBy;
        const sortType = sortBy === "low-to-high" ? "ASC" : "DESC";
        query += ` ORDER BY ${sorter} ${sortType}`;
    }
    if (page) {
        query += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    const totalResult = yield connectDB_1.default.query(totalQuery, params);
    const totalCustomers = totalResult.rows[0].count;
    const products = yield connectDB_1.default.query(query, params);
    return {
        products,
        page: parseInt(page),
        pageSize: limit,
        totalCount: parseInt(totalCustomers),
        totalPages: Math.ceil(totalCustomers / limit)
    };
});
exports.getAllProducts = getAllProducts;
const getSingleProductBySlug = (productSlug) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = `SELECT p.*, ROUND(p.price) AS price , b.name AS brand, c.name AS category,
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.id
    ),
    (SELECT array_agg("size" ORDER BY size ASC) AS sizes
      FROM product_size ps
      WHERE ps.product_id = p.id
    ),
    (SELECT array_agg("tag") AS tags
      FROM product_tag pt
      WHERE pt.product_id = p.id
    )
    FROM product p
    JOIN brand b ON p.brand_id = b.id 
    JOIN category c ON p.category_id = c.id 
    WHERE p.slug = $1 
  `;
    const productResult = yield connectDB_1.default.query(productQuery, [productSlug]);
    if (productResult.rows.length === 0) {
        throw new utils_1.ErrorObj.ClientError("Product not found!", 404);
    }
    return productResult;
});
exports.getSingleProductBySlug = getSingleProductBySlug;
const getProductRecommendations = (productTags, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const recommendationsQuery = `
  SELECT * FROM (
      SELECT p.*, ROUND(p.price) AS price , b.name AS brand, c.name AS category,
      (SELECT array_agg("url") AS images 
        FROM product_image pi 
        WHERE pi.product_id = p.id
      ),
      (SELECT array_agg("size" ORDER BY size ASC) AS sizes
        FROM product_size ps
        WHERE ps.product_id = p.id
      ),
      (SELECT array_agg("tag") AS tags
        FROM product_tag pt
        WHERE pt.product_id = p.id
      )
      FROM product p
      JOIN brand b ON p.brand_id = b.id 
      JOIN category c ON p.category_id = c.id 
    ) AS filtered
  WHERE filtered.tags && ($1) AND filtered.id != $2
  LIMIT 4
  `;
    const recommendationsResult = yield connectDB_1.default.query(recommendationsQuery, [productTags, productId]);
    return recommendationsResult;
});
exports.getProductRecommendations = getProductRecommendations;
const getProductImages = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const imageQuery = `SELECT url FROM product_image WHERE product_id = $1`;
    const imagesResult = yield connectDB_1.default.query(imageQuery, [productId]);
    return imagesResult;
});
exports.getProductImages = getProductImages;
const getProductsPriceRange = () => __awaiter(void 0, void 0, void 0, function* () {
    const priceRangeQuery = `SELECT 
    ROUND(max(price)) as max_price,
    ROUND(min(price)) as min_price 
  FROM product WHERE status = 'active'`;
    const priceRangeResult = yield connectDB_1.default.query(priceRangeQuery);
    return priceRangeResult;
});
exports.getProductsPriceRange = getProductsPriceRange;
const checkProductExistById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = `SELECT id FROM product WHERE id = $1`;
    const productResult = yield connectDB_1.default.query(productQuery, [productId]);
    return productResult.rows.length !== 0;
});
exports.checkProductExistById = checkProductExistById;
