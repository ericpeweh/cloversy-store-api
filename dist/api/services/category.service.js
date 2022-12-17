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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
// Data
const data_1 = require("../data");
const getAllCategories = (page, q, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield data_1.categoryRepo.getAllCategories(page, q, sortBy);
    return result;
});
exports.getAllCategories = getAllCategories;
const createCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const newCategory = yield data_1.categoryRepo.createCategory(categoryData);
    return newCategory;
});
exports.createCategory = createCategory;
const updateCategory = (updatedCategoryData, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedCategory = yield data_1.categoryRepo.updateCategory(updatedCategoryData, categoryId);
    return updatedCategory;
});
exports.updateCategory = updateCategory;
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield data_1.categoryRepo.deleteCategory(categoryId);
    return result;
});
exports.deleteCategory = deleteCategory;
