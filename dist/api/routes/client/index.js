"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Routes
const product_route_1 = __importDefault(require("./product.route"));
const category_route_1 = __importDefault(require("./category.route"));
const brand_route_1 = __importDefault(require("./brand.route"));
const voucher_route_1 = __importDefault(require("./voucher.route"));
const data_route_1 = __importDefault(require("./data.route"));
const account_route_1 = __importDefault(require("./account.route"));
const cart_route_1 = __importDefault(require("./cart.route"));
const transaction_route_1 = __importDefault(require("./transaction.route"));
exports.default = {
    productRouter: product_route_1.default,
    categoryRouter: category_route_1.default,
    brandRouter: brand_route_1.default,
    voucherRouter: voucher_route_1.default,
    dataRouter: data_route_1.default,
    accountRouter: account_route_1.default,
    cartRouter: cart_route_1.default,
    transactionRouter: transaction_route_1.default
};
