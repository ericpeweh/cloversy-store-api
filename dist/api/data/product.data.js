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
exports.deleteProduct = exports.updateProduct = exports.removeProductImagesWithUrl = exports.addProductImages = exports.getProductImages = exports.createProduct = exports.getSingleProductById = exports.getAllProducts = void 0;
// Config
const connectDB_1 = __importDefault(require("../../config/connectDB"));
// Utils
const utils_1 = require("../utils");
const generateUpdateQuery_1 = __importDefault(require("../utils/generateUpdateQuery"));
const getAllProducts = (page, searchQuery, sortBy, productStatus, brandFilter) => __awaiter(void 0, void 0, void 0, function* () {
    let paramsIndex = 0;
    const params = [];
    const limit = 12;
    const offset = parseInt(page) * limit - limit;
    let query = `SELECT p.*, b.name AS brand, 
    (SELECT url FROM product_image pi 
      WHERE pi.product_id = p.id 
      LIMIT 1
    ) AS image 
    FROM product p JOIN brand b
    ON p.brand_id = b.id`;
    let totalQuery = "SELECT COUNT(id) FROM product";
    if (productStatus) {
        query += ` WHERE status = $${paramsIndex + 1}`;
        totalQuery += ` WHERE status = $${paramsIndex + 1}`;
        params.push(productStatus);
        paramsIndex += 1;
    }
    if (brandFilter) {
        const filter = ` ${paramsIndex === 0 ? "WHERE" : "AND"} brand_id = $${paramsIndex + 1}`;
        query += filter;
        totalQuery += filter;
        params.push(brandFilter);
        paramsIndex += 1;
    }
    if (searchQuery) {
        const search = ` ${paramsIndex === 0 ? "WHERE" : "AND"} title iLIKE $${paramsIndex + 1}`;
        query += search;
        totalQuery += search;
        params.push(`%${searchQuery}%`);
        paramsIndex += 1;
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
const getSingleProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
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
  WHERE p.id = $1 
`;
    const productResult = yield connectDB_1.default.query(productQuery, [productId]);
    if (productResult.rows.length === 0) {
        throw new utils_1.ErrorObj.ClientError("Product not found!", 404);
    }
    return productResult;
});
exports.getSingleProductById = getSingleProductById;
const createProduct = (productData, tags, sizes) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    try {
        yield client.query("BEGIN");
        const productQuery = `INSERT INTO product(
      title,
      sku,
      price,
      status,
      category_id,
      brand_id,
      description,
      slug
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const productResult = yield client.query(productQuery, productData);
        const productId = productResult.rows[0].id;
        const tagResult = [];
        const productTagQuery = `INSERT INTO product_tag(
      product_id,
      tag
    ) VALUES ($1, $2) RETURNING tag`;
        tags.forEach((tag) => __awaiter(void 0, void 0, void 0, function* () {
            const addedTag = yield client.query(productTagQuery, [productId, tag]);
            tagResult.push(addedTag.rows[0].tag);
        }));
        const sizeResult = [];
        sizes.forEach((size) => __awaiter(void 0, void 0, void 0, function* () {
            const productSizeQuery = `INSERT INTO product_size(
        product_id,
        size
      ) VALUES ($1, $2) RETURNING size`;
            const addedSize = yield client.query(productSizeQuery, [productId, size]);
            sizeResult.push(addedSize.rows[0].size);
        }));
        yield client.query("COMMIT");
        return { productResult, tagResult, sizeResult };
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
});
exports.createProduct = createProduct;
const getProductImages = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const imageQuery = `SELECT url FROM product_image WHERE product_id = $1`;
    const imagesResult = yield connectDB_1.default.query(imageQuery, [productId]);
    return imagesResult;
});
exports.getProductImages = getProductImages;
const addProductImages = (productId, images) => __awaiter(void 0, void 0, void 0, function* () {
    const imagesResult = [];
    const imageQuery = `INSERT INTO product_image(
      product_id, 
      url
    ) VALUES ($1, $2) RETURNING url`;
    for (const imageResponse of images) {
        const result = yield connectDB_1.default.query(imageQuery, [
            productId,
            `https://storage.googleapis.com/cloversy-store/${imageResponse[1].name}`
        ]);
        imagesResult.push(result.rows[0].url);
    }
    return imagesResult;
});
exports.addProductImages = addProductImages;
const removeProductImagesWithUrl = (productId, imagesUrlToDelete) => __awaiter(void 0, void 0, void 0, function* () {
    const imageQuery = `DELETE FROM product_image WHERE product_id = $1 AND url = ANY ($2)`;
    const result = yield connectDB_1.default.query(imageQuery, [productId, imagesUrlToDelete]);
    return result;
});
exports.removeProductImagesWithUrl = removeProductImagesWithUrl;
const updateProduct = (updateProductData) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    const { updatedProductData, productId, tags, sizes, removedTags, removedSizes } = updateProductData;
    try {
        yield client.query("BEGIN");
        const { query: productQuery, params: productParams } = (0, generateUpdateQuery_1.default)("product", updatedProductData, { id: productId }, ` RETURNING *`);
        const productResult = yield connectDB_1.default.query(productQuery, productParams);
        const tagResult = [];
        tags.forEach((tag) => __awaiter(void 0, void 0, void 0, function* () {
            const productTagQuery = `INSERT INTO product_tag(
	      product_id,
	      tag
	    ) VALUES ($1, $2) RETURNING tag`;
            const addedTag = yield client.query(productTagQuery, [productId, tag]);
            tagResult.push(addedTag.rows[0].tag);
        }));
        const sizeResult = [];
        sizes.forEach((size) => __awaiter(void 0, void 0, void 0, function* () {
            const productSizeQuery = `INSERT INTO product_size(
	      product_id,
	      size
	    ) VALUES ($1, $2) RETURNING size`;
            const addedSize = yield client.query(productSizeQuery, [productId, size]);
            sizeResult.push(addedSize.rows[0].size);
        }));
        removedTags.forEach((tag) => __awaiter(void 0, void 0, void 0, function* () {
            const tagQuery = `DELETE FROM product_tag WHERE tag = $1 AND product_id = $2`;
            yield client.query(tagQuery, [tag, productId]);
        }));
        removedSizes.forEach((size) => __awaiter(void 0, void 0, void 0, function* () {
            const sizeQuery = `DELETE FROM product_size WHERE size = $1 AND product_id = $2`;
            yield client.query(sizeQuery, [size, productId]);
        }));
        const updatedTags = yield client.query("SELECT tag FROM product_tag WHERE product_id = $1", [
            productId
        ]);
        const filteredUpdatedTags = updatedTags.rows.map(item => item.tag);
        const updatedSizes = yield client.query("SELECT size FROM product_size WHERE product_id = $1", [
            productId
        ]);
        const filteredUpdatedSizes = updatedSizes.rows.map(item => item.size);
        yield client.query("COMMIT");
        return { productResult, filteredUpdatedTags, filteredUpdatedSizes };
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    try {
        yield client.query("BEGIN");
        const tagQuery = `DELETE FROM product_tag WHERE product_id = $1`;
        yield client.query(tagQuery, [productId]);
        const sizeQuery = `DELETE FROM product_size WHERE product_id = $1`;
        yield client.query(sizeQuery, [productId]);
        const productQuery = `DELETE FROM product WHERE id = $1 RETURNING id`;
        const productResult = yield client.query(productQuery, [productId]);
        yield client.query("COMMIT");
        return productResult;
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
});
exports.deleteProduct = deleteProduct;
