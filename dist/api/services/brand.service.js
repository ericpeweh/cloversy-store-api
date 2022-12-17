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
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getAllBrands = void 0;
// Data
const data_1 = require("../data");
const getAllBrands = (page, q, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    const brands = yield data_1.brandRepo.getAllBrands(page, q, sortBy);
    return brands;
});
exports.getAllBrands = getAllBrands;
const createBrand = (brandData) => __awaiter(void 0, void 0, void 0, function* () {
    const newBrand = yield data_1.brandRepo.createBrand(brandData);
    return newBrand;
});
exports.createBrand = createBrand;
const updateBrand = (updatedBrandData, brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBrand = yield data_1.brandRepo.updateBrand(updatedBrandData, brandId);
    return updatedBrand;
});
exports.updateBrand = updateBrand;
const deleteBrand = (brandId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield data_1.brandRepo.deleteBrand(brandId);
    return result;
});
exports.deleteBrand = deleteBrand;
