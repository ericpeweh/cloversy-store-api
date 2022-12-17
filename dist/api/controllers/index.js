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
exports.authController = exports.voucherController = exports.userController = exports.brandController = exports.categoryController = exports.productController = void 0;
// Controllers
const productController = __importStar(require("./product.controller"));
exports.productController = productController;
const categoryController = __importStar(require("./category.controller"));
exports.categoryController = categoryController;
const brandController = __importStar(require("./brand.controller"));
exports.brandController = brandController;
const userController = __importStar(require("./user.controller"));
exports.userController = userController;
const voucherController = __importStar(require("./voucher.controller"));
exports.voucherController = voucherController;
const authController = __importStar(require("./auth.controller"));
exports.authController = authController;
