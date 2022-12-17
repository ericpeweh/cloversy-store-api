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
exports.deleteCartItem = exports.updateCartItem = exports.addProductToCart = exports.clearSessionCart = exports.syncCartItems = exports.getCartItems = void 0;
const nanoid_1 = require("nanoid");
// Services
const client_1 = require("../../services/client");
const utils_1 = require("../../utils");
// Helper function
const getCartResultFromSession = (updatedCart) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemsDetails = yield client_1.cartService.getSessionCartItemsDetails(updatedCart.map(item => item.product_id));
    const cartResult = updatedCart.map(item => {
        const cartItemData = cartItemsDetails.rows.find(product => product.id === item.product_id);
        return Object.assign(Object.assign({}, cartItemData), { quantity: item === null || item === void 0 ? void 0 : item.quantity, size: item === null || item === void 0 ? void 0 : item.size, id: item === null || item === void 0 ? void 0 : item.id });
    });
    return cartResult;
});
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        let cart;
        let sync = false;
        if (!userId) {
            // Return session cart items
            const currentCart = req.session.cart || [];
            const cartResult = yield getCartResultFromSession(currentCart);
            cart = cartResult;
        }
        else {
            const cartResultDB = yield client_1.cartService.getDBCartItemsDetails(userId);
            if (req.session.cart && ((_b = req.session.cart) === null || _b === void 0 ? void 0 : _b.length) !== 0) {
                sync = true;
            }
            cart = cartResultDB.rows;
        }
        res.status(200).json({
            status: "success",
            data: Object.assign({ cart }, (userId && { sync }))
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getCartItems = getCartItems;
const syncCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    try {
        if (!userId) {
            throw new utils_1.ErrorObj.ClientError("You're not logged in!");
        }
        else {
            // Sync session cart to db
            const sessionCartItems = req.session.cart || [];
            if (sessionCartItems.length < 1) {
                throw new utils_1.ErrorObj.ClientError("Session cart is empty!");
            }
            yield client_1.cartService.syncCartItems(sessionCartItems, userId);
            // Clear cart session
            req.session.cart = [];
            const cartResultDB = yield client_1.cartService.getDBCartItemsDetails(userId);
            const cart = cartResultDB.rows;
            return res.status(200).json({
                status: "success",
                data: Object.assign({ cart }, (userId && { sync: false }))
            });
        }
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.syncCartItems = syncCartItems;
const clearSessionCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.cart = [];
        return res.status(200).json({
            status: "success"
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.clearSessionCart = clearSessionCart;
const addProductToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    const { product_id, quantity, size } = req.body;
    const newCartItem = {
        id: (0, nanoid_1.nanoid)(),
        product_id,
        size,
        quantity
    };
    let cartResult = [];
    try {
        if (!product_id || isNaN(+quantity) || isNaN(+size)) {
            throw new utils_1.ErrorObj.ClientError("Cart data not valid, please provide a valid data.");
        }
        if (+quantity === 0) {
            throw new utils_1.ErrorObj.ClientError("Quantity should not be 0.");
        }
        if (!userId) {
            const currentCart = req.session.cart || [];
            const updatedCart = client_1.cartService.addProductToSessionCart(currentCart, newCartItem);
            req.session.cart = updatedCart;
            cartResult = yield getCartResultFromSession(updatedCart);
        }
        else {
            // Add product to db
            yield client_1.cartService.addProductToDBCart(newCartItem, userId);
            cartResult = (yield client_1.cartService.getDBCartItemsDetails(userId)).rows;
        }
        return res.status(200).json({
            status: "success",
            data: { cart: cartResult }
        });
    }
    catch (error) {
        console.error(error.stack);
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.addProductToCart = addProductToCart;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
    const { id: cartItemId, quantity } = req.body;
    try {
        if (!cartItemId || isNaN(+quantity)) {
            throw new utils_1.ErrorObj.ClientError("Cart data not valid, please provide a valid data.");
        }
        if (+quantity === 0) {
            throw new utils_1.ErrorObj.ClientError("Quantity should not be 0.");
        }
        let cartResult;
        if (!userId) {
            // Edit product in session cart
            const currentCart = req.session.cart || [];
            const updatedCart = client_1.cartService.updateCartItemInCartSession(currentCart, cartItemId, quantity);
            req.session.cart = updatedCart;
            cartResult = yield getCartResultFromSession(updatedCart);
        }
        else {
            // Edit product to db
            yield client_1.cartService.updateCartItemInDB(cartItemId, quantity, userId);
            cartResult = (yield client_1.cartService.getDBCartItemsDetails(userId)).rows;
        }
        return res.status(200).json({
            status: "success",
            data: { cart: cartResult }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.updateCartItem = updateCartItem;
const deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
    const { id: cartItemId } = req.body;
    let cartResult;
    try {
        if (!cartItemId) {
            throw new utils_1.ErrorObj.ClientError("Invalid cart item id!");
        }
        if (!userId) {
            // Edit product in session cart
            const currentCart = req.session.cart || [];
            const updatedCart = client_1.cartService.deleteCartItemInCartSession(currentCart, cartItemId);
            req.session.cart = updatedCart;
            cartResult = yield getCartResultFromSession(updatedCart);
        }
        else {
            // Edit product to db
            yield client_1.cartService.deleteCartItemInDB(cartItemId, userId);
            cartResult = (yield client_1.cartService.getDBCartItemsDetails(userId)).rows;
        }
        return res.status(200).json({
            status: "success",
            data: { cart: cartResult }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.deleteCartItem = deleteCartItem;
