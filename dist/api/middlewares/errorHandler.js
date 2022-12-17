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
const errorHandler = (error, _, res, _1) => __awaiter(void 0, void 0, void 0, function* () {
    if (error.name === "UnauthorizedError") {
        return res.status(error.status).json({ status: "error", message: error.message });
    }
    else {
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.default = errorHandler;
