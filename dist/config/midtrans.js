"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const dotenv_1 = __importDefault(require("dotenv"));
const midtrans_client_1 = __importDefault(require("midtrans-client"));
dotenv_1.default.config();
const coreAPI = new midtrans_client_1.default.CoreApi({
    isProduction: process.env.NODE_ENV === "production",
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});
exports.default = coreAPI;
