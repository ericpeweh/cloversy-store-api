"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = exports.cartService = exports.wishlistService = exports.userService = exports.addressService = exports.dataService = exports.voucherService = exports.brandService = exports.categoryService = exports.productService = void 0;
// Services
const productService = __importStar(require("./product.service"));
exports.productService = productService;
const categoryService = __importStar(require("./category.service"));
exports.categoryService = categoryService;
const brandService = __importStar(require("./brand.service"));
exports.brandService = brandService;
const voucherService = __importStar(require("./voucher.service"));
exports.voucherService = voucherService;
const dataService = __importStar(require("./data.service"));
exports.dataService = dataService;
const addressService = __importStar(require("./address.service"));
exports.addressService = addressService;
const userService = __importStar(require("./user.service"));
exports.userService = userService;
const wishlistService = __importStar(require("./wishlist.service"));
exports.wishlistService = wishlistService;
const cartService = __importStar(require("./cart.service"));
exports.cartService = cartService;
const transactionService = __importStar(require("./transaction.service"));
exports.transactionService = transactionService;
