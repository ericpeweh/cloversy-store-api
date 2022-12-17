"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const upload = (0, multer_1.default)({
    dest: path_1.default.join(process.cwd(), "/uploads"),
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});
exports.default = upload;
