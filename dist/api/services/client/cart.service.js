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
exports.deleteCartItemInDB = exports.deleteCartItemInCartSession = exports.updateCartItemInDB = exports.updateCartItemInCartSession = exports.syncCartItems = exports.addProductToDBCart = exports.addProductToSessionCart = exports.getDBCartItemsDetails = exports.getSessionCartItemsDetails = void 0;
// Data
const client_1 = require("../../data/client");
// Utils
const utils_1 = require("../../utils");
const getSessionCartItemsDetails = (productIds) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield client_1.cartRepo.getSessionCartItemsDetails(productIds);
    return cartItems;
});
exports.getSessionCartItemsDetails = getSessionCartItemsDetails;
const getDBCartItemsDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItems = yield client_1.cartRepo.getDBCartItemsDetails(userId);
    return cartItems;
});
exports.getDBCartItemsDetails = getDBCartItemsDetails;
const addProductToSessionCart = (currentCart, newCartItem) => {
    // Add product to session cart
    const { product_id, size, quantity } = newCartItem;
    let updatedCart;
    const isExist = currentCart.findIndex(item => item.product_id === product_id && item.size === size) !== -1;
    if (isExist) {
        updatedCart = currentCart.map(item => {
            return item.product_id === product_id
                ? Object.assign(Object.assign({}, item), { quantity: item.quantity || 0 + quantity }) : item;
        });
    }
    else {
        updatedCart = [...currentCart, newCartItem];
    }
    return updatedCart;
};
exports.addProductToSessionCart = addProductToSessionCart;
const addProductToDBCart = (newCartItem, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id } = newCartItem;
    const isProductExist = yield client_1.productRepo.checkProductExistById(product_id + "");
    if (!isProductExist) {
        throw new utils_1.ErrorObj.ClientError("Product not found!", 404);
    }
    const isExist = yield client_1.cartRepo.checkCartItemExist(newCartItem, userId);
    let cartItem;
    if (isExist) {
        cartItem = (yield client_1.cartRepo.updateCartItemWithoutId(newCartItem, userId)).rows;
    }
    else {
        cartItem = (yield client_1.cartRepo.addCartItemToDB(newCartItem, userId)).rows;
    }
    return cartItem;
});
exports.addProductToDBCart = addProductToDBCart;
const syncCartItems = (sessionCartItems, userId) => __awaiter(void 0, void 0, void 0, function* () {
    for (const cartItem of sessionCartItems) {
        yield client_1.cartRepo.addCartItemToDBIfNotExist(cartItem, userId);
    }
});
exports.syncCartItems = syncCartItems;
const updateCartItemInCartSession = (currentCart, cartItemId, quantity) => {
    // Update car item quantity to session cart
    const isExist = currentCart.findIndex(item => item.id === cartItemId) !== -1;
    if (!isExist) {
        throw new utils_1.ErrorObj.ClientError("Cart item not found!");
    }
    const updatedCart = currentCart.map(item => {
        return item.id === cartItemId
            ? Object.assign(Object.assign({}, item), { quantity }) : item;
    });
    return updatedCart;
};
exports.updateCartItemInCartSession = updateCartItemInCartSession;
const updateCartItemInDB = (cartItemId, quantity, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = client_1.cartRepo.checkCartItemExistById(cartItemId);
    if (!isExist) {
        throw new utils_1.ErrorObj.ClientError("Cart item not found!");
    }
    const isAuthorized = client_1.cartRepo.checkCartItemAuthorized(cartItemId, userId);
    if (!isAuthorized) {
        throw new utils_1.ErrorObj.ClientError("You're not authorized", 403);
    }
    yield client_1.cartRepo.updateCartItemById(cartItemId, quantity, userId);
});
exports.updateCartItemInDB = updateCartItemInDB;
const deleteCartItemInCartSession = (currentCart, cartItemId) => {
    // Delete cart item from session cart
    const isExist = currentCart.findIndex(item => item.id === cartItemId) !== -1;
    if (!isExist) {
        throw new utils_1.ErrorObj.ClientError("Cart item not found!");
    }
    const updatedCart = currentCart.filter(item => item.id !== cartItemId);
    return updatedCart;
};
exports.deleteCartItemInCartSession = deleteCartItemInCartSession;
const deleteCartItemInDB = (cartItemId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete cart item from session cart
    const isExist = client_1.cartRepo.checkCartItemExistById(cartItemId);
    if (!isExist) {
        throw new utils_1.ErrorObj.ClientError("Cart item not found!");
    }
    const isAuthorized = client_1.cartRepo.checkCartItemAuthorized(cartItemId, userId);
    if (!isAuthorized) {
        throw new utils_1.ErrorObj.ClientError("You're not authorized", 403);
    }
    yield client_1.cartRepo.deleteCartItemById(cartItemId, userId);
});
exports.deleteCartItemInDB = deleteCartItemInDB;
