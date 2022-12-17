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
exports.getSingleProductBySlug = exports.getAllProducts = void 0;
// Services
const client_1 = require("../../services/client");
// Utils
const utils_1 = require("../../utils");
// Types
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brand: brandFilter = "", sortBy = "id", page = "", q = "", count = "", price: priceFilter = "" } = req.query;
    try {
        if (typeof sortBy !== "string" ||
            typeof q !== "string" ||
            typeof page !== "string" ||
            typeof brandFilter !== "string" ||
            typeof count !== "string" ||
            typeof priceFilter !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'page', 'q', 'brand', 'count', 'price', and 'sortBy' has to be type of string");
        }
        if (!["low-to-high", "high-to-low", "rating", "popularity", "id", ""].includes(sortBy)) {
            throw new utils_1.ErrorObj.ClientError("Query param 'sortBy' is not supported");
        }
        const { products, priceRange } = yield client_1.productService.getAllProducts(page, q, sortBy, brandFilter, count, priceFilter);
        const { products: productsData } = products, paginationData = __rest(products, ["products"]);
        const minPrice = +priceRange.rows[0].min_price;
        const maxPrice = +priceRange.rows[0].max_price;
        res.status(200).json(Object.assign(Object.assign({ status: "success" }, paginationData), { data: { products: productsData.rows, priceRange: [minPrice, maxPrice] } }));
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getAllProducts = getAllProducts;
const getSingleProductBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productSlug } = req.params;
        if (typeof productSlug !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'id' has to be type of string");
        }
        const { productResult, recommendationsResult } = yield client_1.productService.getSingleProductBySlug(productSlug);
        res.status(200).json({
            status: "success",
            data: { product: Object.assign(Object.assign({}, productResult.rows[0]), { recommendations: recommendationsResult.rows }) }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getSingleProductBySlug = getSingleProductBySlug;
