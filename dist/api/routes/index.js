"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Routes
const product_route_1 = __importDefault(require("./product.route"));
const category_route_1 = __importDefault(require("./category.route"));
const brand_route_1 = __importDefault(require("./brand.route"));
const user_route_1 = __importDefault(require("./user.route"));
const voucher_route_1 = __importDefault(require("./voucher.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
exports.default = {
    productRouter: product_route_1.default,
    categoryRouter: category_route_1.default,
    brandRouter: brand_route_1.default,
    userRouter: user_route_1.default,
    voucherRouter: voucher_route_1.default,
    authRouter: auth_route_1.default
};
