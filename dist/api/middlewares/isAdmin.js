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
// Service
const services_1 = require("../services");
// Utils
const utils_1 = require("../utils");
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.auth === undefined) {
            throw new utils_1.ErrorObj.ServerError("Failed to check user authority, please try again.");
        }
        const user = yield services_1.userService.getUserDataBySub(req.auth.sub);
        const userRole = user.user_role;
        if (userRole !== "admin") {
            throw new utils_1.ErrorObj.ClientError("Access denied", 403);
        }
        return next();
    }
    catch (error) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
});
exports.default = isAdmin;
