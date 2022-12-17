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
exports.deleteCartItemById = exports.addCartItemToDBIfNotExist = exports.addCartItemToDB = exports.updateCartItemById = exports.updateCartItemWithoutId = exports.checkCartItemAuthorized = exports.checkCartItemExistById = exports.checkCartItemExist = exports.getDBCartItemsDetails = exports.getSessionCartItemsDetails = void 0;
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
const getSessionCartItemsDetails = (productIds) => __awaiter(void 0, void 0, void 0, function* () {
    const uniqueProductIds = [...new Set(productIds)];
    const cartItemsQuery = `SELECT p.*, b.name AS brand, 
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
    WHERE p.status = 'active'
    AND p.id = ANY ($1)
  `;
    const cartItemsResult = yield connectDB_1.default.query(cartItemsQuery, [uniqueProductIds]);
    return cartItemsResult;
});
exports.getSessionCartItemsDetails = getSessionCartItemsDetails;
const getDBCartItemsDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemsQuery = `SELECT p.*, p.id as product_id, b.name AS brand, c.id AS id, c.quantity AS quantity, c.size AS size,
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
    FROM cart c
    JOIN product p ON p.id = c.product_id
    JOIN brand b ON p.brand_id = b.id
    WHERE c.user_id = $1
    AND p.status = 'active'
    ORDER BY c.id DESC
  `;
    const cartItemsResult = yield connectDB_1.default.query(cartItemsQuery, [userId]);
    return cartItemsResult;
});
exports.getDBCartItemsDetails = getDBCartItemsDetails;
const checkCartItemExist = (newCartItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, size } = newCartItem;
    const cartItemQuery = `SELECT id FROM cart
    WHERE user_id = $1
    AND product_id = $2
    AND size = $3
  `;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [userId, product_id, size]);
    return cartItemResult.rowCount > 0;
});
exports.checkCartItemExist = checkCartItemExist;
const checkCartItemExistById = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemQuery = `SELECT id FROM cart WHERE id = $1`;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [cartItemId]);
    return cartItemResult.rowCount > 0;
});
exports.checkCartItemExistById = checkCartItemExistById;
const checkCartItemAuthorized = (cartItemId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemQuery = `SELECT id FROM cart WHERE id = $1 AND user_id = $2`;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [cartItemId, userId]);
    return cartItemResult.rowCount > 0;
});
exports.checkCartItemAuthorized = checkCartItemAuthorized;
const updateCartItemWithoutId = (updatedCartItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, size, quantity } = updatedCartItem;
    const cartItemQuery = `UPDATE cart
    SET quantity = quantity + $1 
    WHERE user_id = $2
    AND product_id = $3
    AND size = $4
    RETURNING *
  `;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [quantity, userId, product_id, size]);
    return cartItemResult;
});
exports.updateCartItemWithoutId = updateCartItemWithoutId;
const updateCartItemById = (cartItemId, quantity, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemQuery = `UPDATE cart
    SET quantity = $1
    WHERE id = $2
    AND user_id = $3
  `;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [quantity, cartItemId, userId]);
    return cartItemResult;
});
exports.updateCartItemById = updateCartItemById;
const addCartItemToDB = (newCartItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, size, quantity } = newCartItem;
    const cartItemQuery = `INSERT INTO cart(
    user_id, product_id, size, quantity
  ) 
  VALUES ($1, $2, $3, $4) RETURNING *
  `;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [userId, product_id, size, quantity]);
    return cartItemResult;
});
exports.addCartItemToDB = addCartItemToDB;
const addCartItemToDBIfNotExist = (newCartItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, size, quantity } = newCartItem;
    const cartItemQuery = `INSERT INTO cart(
    user_id, product_id, size, quantity
  ) 
  VALUES ($1, $2, $3, $4) 
  ON CONFLICT DO NOTHING
  RETURNING *
  `;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [userId, product_id, size, quantity]);
    return cartItemResult;
});
exports.addCartItemToDBIfNotExist = addCartItemToDBIfNotExist;
const deleteCartItemById = (cartItemId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemQuery = `DELETE FROM cart
    WHERE id = $1
    AND user_id = $2
  `;
    const cartItemResult = yield connectDB_1.default.query(cartItemQuery, [cartItemId, userId]);
    return cartItemResult;
});
exports.deleteCartItemById = deleteCartItemById;
