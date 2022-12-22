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
exports.transactionRepo = exports.cartRepo = exports.wishlistRepo = exports.userRepo = exports.addressRepo = exports.voucherRepo = exports.brandRepo = exports.categoryRepo = exports.productRepo = void 0;
// Data
const productRepo = __importStar(require("./product.data"));
exports.productRepo = productRepo;
const categoryRepo = __importStar(require("./category.data"));
exports.categoryRepo = categoryRepo;
const brandRepo = __importStar(require("./brand.data"));
exports.brandRepo = brandRepo;
const voucherRepo = __importStar(require("./voucher.data"));
exports.voucherRepo = voucherRepo;
const addressRepo = __importStar(require("./address.data"));
exports.addressRepo = addressRepo;
const userRepo = __importStar(require("./user.data"));
exports.userRepo = userRepo;
const wishlistRepo = __importStar(require("./wishlist.data"));
exports.wishlistRepo = wishlistRepo;
const cartRepo = __importStar(require("./cart.data"));
exports.cartRepo = cartRepo;
const transactionRepo = __importStar(require("./transaction.data"));
exports.transactionRepo = transactionRepo;