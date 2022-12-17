"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const express_jwt_1 = require("express-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
dotenv_1.default.config();
const isAuth = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.JWKS_URI
    }),
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    algorithms: ["RS256"]
});
exports.default = isAuth;
