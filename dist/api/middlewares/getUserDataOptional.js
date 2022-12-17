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
const getUserDataOptional = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.auth === undefined) {
            return next();
        }
        const user = yield services_1.userService.getUserDataBySub(req.auth.sub);
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
});
exports.default = getUserDataOptional;
