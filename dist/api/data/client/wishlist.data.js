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
exports.emptyWishlist = exports.deleteProductFromWishlist = exports.addProductToWishlist = exports.checkProductIsWishlisted = exports.getWishlistData = exports.getWishlistProducts = void 0;
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
const getWishlistProducts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistQuery = `SELECT p.*, b.name AS brand, 
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
    FROM wishlist w 
    JOIN product p
      ON w.product_id = p.id
    JOIN brand b
      ON p.brand_id = b.id
    WHERE w.user_id = $1
    ORDER BY w.id DESC
  `;
    const wishlistResult = yield connectDB_1.default.query(wishlistQuery, [userId]);
    return wishlistResult;
});
exports.getWishlistProducts = getWishlistProducts;
const getWishlistData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM wishlist WHERE user_id = $1 ORDER BY id DESC`;
    const result = yield connectDB_1.default.query(query, [userId]);
    return result;
});
exports.getWishlistData = getWishlistData;
const checkProductIsWishlisted = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2`;
    const result = yield connectDB_1.default.query(query, [userId, productId]);
    return result.rows.length !== 0;
});
exports.checkProductIsWishlisted = checkProductIsWishlisted;
const addProductToWishlist = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO wishlist(
    user_id,
    product_id
  ) VALUES ($1, $2)`;
    const result = yield connectDB_1.default.query(query, [userId, productId]);
    return result;
});
exports.addProductToWishlist = addProductToWishlist;
const deleteProductFromWishlist = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2`;
    const result = yield connectDB_1.default.query(query, [userId, productId]);
    return result;
});
exports.deleteProductFromWishlist = deleteProductFromWishlist;
const emptyWishlist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM wishlist WHERE user_id = $1`;
    const result = yield connectDB_1.default.query(query, [userId]);
    return result;
});
exports.emptyWishlist = emptyWishlist;
