"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const nanoid_1 = require("nanoid");
const generateUniqueId = (digits = 10, alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ") => {
    return (0, nanoid_1.customAlphabet)(alphabet, digits)();
};
exports.default = generateUniqueId;
