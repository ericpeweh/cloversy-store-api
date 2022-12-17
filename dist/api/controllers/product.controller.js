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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingleProductById = exports.getAllProducts = void 0;
// Services
const services_1 = require("../services");
// Utils
const utils_1 = require("../utils");
// Types
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status: productStatus = "", brand: brandFilter = "", sortBy = "id", page = "", q = "" } = req.query;
    try {
        if (typeof sortBy !== "string" ||
            typeof q !== "string" ||
            typeof page !== "string" ||
            typeof productStatus !== "string" ||
            typeof brandFilter !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'page', 'q', 'status', and 'sortBy' has to be type of string");
        }
        if (!["low-to-high", "high-to-low", "rating", "popularity", "id", ""].includes(sortBy)) {
            throw new utils_1.ErrorObj.ClientError("Query param 'sortBy' is not supported");
        }
        const _a = yield services_1.productService.getAllProducts(page, q, sortBy, productStatus, brandFilter), { products } = _a, paginationData = __rest(_a, ["products"]);
        res.status(200).json(Object.assign(Object.assign({ status: "success" }, paginationData), { data: { products: products.rows } }));
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getAllProducts = getAllProducts;
const getSingleProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        if (typeof productId !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'id' has to be type of string");
        }
        const result = yield services_1.productService.getSingleProduct(productId);
        res.status(200).json({
            status: "success",
            data: { product: result.rows[0] }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getSingleProductById = getSingleProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, sku, price, status, category_id, brand_id, description, slug, tags = [], sizes = [] } = req.body;
        const images = req.files;
        const postQueryData = [title, sku, price, status, category_id, brand_id, description, slug];
        const result = yield services_1.productService.createProduct(postQueryData, tags.split(","), sizes.split(","), images);
        res.status(200).json({
            status: "success",
            data: { newProduct: result }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { title, sku, price, status, category_id, brand_id, description, slug, tags = "", sizes = "", removedTags = "", removedSizes = "", removedImages = "" } = req.body;
        const images = req.files;
        const updatedProductData = {
            title,
            sku,
            price,
            status,
            category_id,
            brand_id,
            description,
            slug
        };
        const result = yield services_1.productService.updateProduct({
            updatedProductData,
            productId,
            tags: tags.length > 0 ? tags.split(",") : [],
            sizes: sizes.length > 0 ? sizes.split(",") : [],
            removedTags: removedTags.length > 0 ? removedTags.split(",") : [],
            removedSizes: removedSizes.length > 0 ? removedSizes.split(",") : [],
            removedImages: removedImages.length > 0 ? removedImages.split(",") : []
        }, images);
        res.status(200).json({
            status: "success",
            data: { updatedProduct: result }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield services_1.productService.deleteProduct(productId);
        res.status(200).json({
            status: "success",
            data: { deletedProductId: result.rows[0].id }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.deleteProduct = deleteProduct;
