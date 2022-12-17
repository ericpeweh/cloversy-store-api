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
exports.emptyWishlist = exports.deleteProductFromWishlist = exports.addProductToWishlist = exports.getUserWishlist = void 0;
// Services
const client_1 = require("../../services/client");
const utils_1 = require("../../utils");
// Types
const getUserWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const result = yield client_1.wishlistService.getWishlistProducts(userId);
        res.status(200).json({
            status: "success",
            data: { wishlist: result.rows }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getUserWishlist = getUserWishlist;
const addProductToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { productId } = req.params;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const result = yield client_1.wishlistService.addProductToWishlist(productId, userId);
        res.status(200).json({
            status: "success",
            data: { wishlist: result.rows }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.addProductToWishlist = addProductToWishlist;
const deleteProductFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    const { productId } = req.params;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const result = yield client_1.wishlistService.deleteProductFromWishlist(productId, userId);
        res.status(200).json({
            status: "success",
            data: { wishlist: result.rows }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.deleteProductFromWishlist = deleteProductFromWishlist;
const emptyWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("Failed to identity user!");
        }
        const result = yield client_1.wishlistService.emptyWishlist(userId);
        res.status(200).json({
            status: "success",
            data: { wishlist: result.rows }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.emptyWishlist = emptyWishlist;
