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
exports.emptyWishlist = exports.deleteProductFromWishlist = exports.addProductToWishlist = exports.getWishlistProducts = void 0;
// Data
const client_1 = require("../../data/client");
// Utils
const utils_1 = require("../../utils");
const getWishlistProducts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlist = yield client_1.wishlistRepo.getWishlistProducts(userId);
    return wishlist;
});
exports.getWishlistProducts = getWishlistProducts;
const addProductToWishlist = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check product exist
    const exist = yield client_1.productRepo.checkProductExistById(productId);
    if (!exist) {
        throw new utils_1.ErrorObj.ClientError("Product not found!", 404);
    }
    const wishlisted = yield client_1.wishlistRepo.checkProductIsWishlisted(productId, userId);
    if (wishlisted) {
        throw new utils_1.ErrorObj.ClientError("Product already wishlisted!", 404);
    }
    yield client_1.wishlistRepo.addProductToWishlist(productId, userId);
    const wishlist = yield client_1.wishlistRepo.getWishlistData(userId);
    return wishlist;
});
exports.addProductToWishlist = addProductToWishlist;
const deleteProductFromWishlist = (productId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check product exist
    const exist = yield client_1.productRepo.checkProductExistById(productId);
    if (!exist) {
        throw new utils_1.ErrorObj.ClientError("Product not found!", 404);
    }
    const wishlisted = yield client_1.wishlistRepo.checkProductIsWishlisted(productId, userId);
    if (!wishlisted) {
        throw new utils_1.ErrorObj.ClientError("Product not found in wishlist!", 404);
    }
    yield client_1.wishlistRepo.deleteProductFromWishlist(productId, userId);
    const wishlist = yield client_1.wishlistRepo.getWishlistData(userId);
    return wishlist;
});
exports.deleteProductFromWishlist = deleteProductFromWishlist;
const emptyWishlist = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlist = yield client_1.wishlistRepo.emptyWishlist(userId);
    return wishlist;
});
exports.emptyWishlist = emptyWishlist;
