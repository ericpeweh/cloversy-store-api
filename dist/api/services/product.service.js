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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingleProduct = exports.getAllProducts = void 0;
// Dependencies
const fs_1 = __importDefault(require("fs"));
// Data
const data_1 = require("../data");
// Config
const cloudStorage_1 = __importDefault(require("../../config/cloudStorage"));
const getAllProducts = (page, q, sortBy, productStatus, brandFilter) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield data_1.productRepo.getAllProducts(page, q, sortBy, productStatus, brandFilter);
    return products;
});
exports.getAllProducts = getAllProducts;
const getSingleProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const productResult = yield data_1.productRepo.getSingleProductById(productId);
    return productResult;
});
exports.getSingleProduct = getSingleProduct;
const createProduct = (postData, tags, sizes, images) => __awaiter(void 0, void 0, void 0, function* () {
    const { productResult, tagResult, sizeResult } = yield data_1.productRepo.createProduct(postData, tags, sizes);
    const newProductId = productResult.rows[0].id;
    // Upload images to google cloud storage
    const imagePromises = [];
    images.forEach(image => {
        imagePromises.push(cloudStorage_1.default.upload(image.path, {
            destination: `products/product-${newProductId}-${image.filename}.jpeg`
        }));
    });
    const cloudImagesResponse = yield Promise.all(imagePromises);
    const imagesResult = yield data_1.productRepo.addProductImages(newProductId, cloudImagesResponse);
    const newProduct = Object.assign(Object.assign({}, productResult.rows[0]), { tags: tagResult, sizes: sizeResult, images: imagesResult });
    images.forEach(storedImage => fs_1.default.unlink(storedImage.path, () => { }));
    return newProduct;
});
exports.createProduct = createProduct;
const updateProduct = (updatedProductData, images) => __awaiter(void 0, void 0, void 0, function* () {
    const { productResult, filteredUpdatedTags, filteredUpdatedSizes } = yield data_1.productRepo.updateProduct(updatedProductData);
    const updatedProductId = productResult.rows[0].id;
    // Upload images to google cloud storage
    const imagePromises = [];
    images.forEach(image => {
        imagePromises.push(cloudStorage_1.default.upload(image.path, {
            destination: `products/product-${updatedProductId}-${image.filename}.jpeg`
        }));
    });
    const cloudImagesResponse = yield Promise.all(imagePromises);
    yield data_1.productRepo.addProductImages(updatedProductId, cloudImagesResponse);
    // Delete image from local
    images.forEach(storedImage => fs_1.default.unlink(storedImage.path, () => { }));
    // Delete image from google cloud storage
    const deleteImagePromises = [];
    updatedProductData.removedImages.forEach(url => {
        deleteImagePromises.push(cloudStorage_1.default.file(url.replace("https://storage.googleapis.com/cloversy-store/", "")).delete());
    });
    yield Promise.all(imagePromises);
    // Remove images from DB
    yield data_1.productRepo.removeProductImagesWithUrl(updatedProductId, updatedProductData.removedImages);
    // Retrieve updated product images list
    const imagesResult = yield data_1.productRepo.getProductImages(updatedProductId);
    const updatedProduct = Object.assign(Object.assign({}, productResult.rows[0]), { tags: filteredUpdatedTags, sizes: filteredUpdatedSizes, images: imagesResult.rows.map(url => url) });
    return updatedProduct;
});
exports.updateProduct = updateProduct;
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield data_1.productRepo.deleteProduct(productId);
    return result;
});
exports.deleteProduct = deleteProduct;
