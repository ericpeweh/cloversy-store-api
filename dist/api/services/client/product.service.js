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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProductBySlug = exports.getAllProducts = void 0;
// Data
const client_1 = require("../../data/client");
const getAllProducts = (page, q, sortBy, brandFilter, count, priceFilter) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield client_1.productRepo.getAllProducts(page, q, sortBy, brandFilter, count, priceFilter);
    const priceRange = yield client_1.productRepo.getProductsPriceRange();
    return { products, priceRange };
});
exports.getAllProducts = getAllProducts;
const getSingleProductBySlug = (productSlug) => __awaiter(void 0, void 0, void 0, function* () {
    const productResult = yield client_1.productRepo.getSingleProductBySlug(productSlug);
    const productId = productResult.rows[0].id;
    const productTags = productResult.rows[0].tags;
    const recommendationsResult = yield client_1.productRepo.getProductRecommendations(productTags, productId);
    return { productResult, recommendationsResult };
});
exports.getSingleProductBySlug = getSingleProductBySlug;
