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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
// Services
const services_1 = require("../services");
// Utils
const utils_1 = require("../utils");
// Types
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = "", q = "", sortBy = "id" } = req.query;
    try {
        if (typeof sortBy !== "string" || typeof q !== "string" || typeof page !== "string") {
            throw new utils_1.ErrorObj.ClientError("Query param 'page', 'q', and 'sortBy' has to be type of string");
        }
        if (!["product_amount", "a-z", "z-a", "id", ""].includes(sortBy)) {
            throw new utils_1.ErrorObj.ClientError("Query param 'sortBy' is not supported");
        }
        const _a = yield services_1.categoryService.getAllCategories(page, q, sortBy), { categories } = _a, paginationData = __rest(_a, ["categories"]);
        res.status(200).json(Object.assign(Object.assign({ status: "success" }, paginationData), { data: { categories: categories.rows } }));
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getAllCategories = getAllCategories;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, identifier } = req.body;
        const categoryQueryData = [name, description, identifier];
        const result = yield services_1.categoryService.createCategory(categoryQueryData);
        res.status(200).json({
            status: "success",
            data: { newCategory: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const { name, description, identifier } = req.body;
        const updatedCategoryData = [name, description, identifier];
        const result = yield services_1.categoryService.updateCategory(updatedCategoryData, categoryId);
        res.status(200).json({
            status: "success",
            data: { updatedCategory: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const result = yield services_1.categoryService.deleteCategory(categoryId);
        res.status(200).json({
            status: "success",
            data: { deletedCategory: result.rows[0] }
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.deleteCategory = deleteCategory;
