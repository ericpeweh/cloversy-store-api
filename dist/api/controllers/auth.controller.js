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
exports.resetPassword = exports.authUser = void 0;
// Utils
const utils_1 = require("../utils");
// Services
const services_1 = require("../services");
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const auth0UserData = yield services_1.authService.getUserInfoAuth0(accessToken);
        let userData = yield services_1.userService.getUserDataByEmail(auth0UserData.email);
        if (userData === undefined) {
            userData = yield services_1.userService.createNewUser([
                auth0UserData.name,
                auth0UserData.email,
                auth0UserData.picture,
                auth0UserData.sub
            ]);
        }
        res.status(200).json({
            status: "success",
            data: { user: userData }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.authUser = authUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userEmail = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email;
    try {
        if (userEmail === undefined) {
            throw new utils_1.ErrorObj.ServerError("Failed to check user authority, please try again.");
        }
        const result = yield services_1.authService.resetPasswordAuth0(userEmail);
        res.status(200).json({
            status: "success",
            data: { result }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.resetPassword = resetPassword;
