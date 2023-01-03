// Dependencies
import fs from "fs";

// Data
import { productRepo, reviewRepo } from "../data";

// Types
import { UpdateProductDataArgs } from "../interfaces";

// Config
import bucket from "../../config/cloudStorage";
import { UploadResponse, DeleteFileResponse } from "@google-cloud/storage";

export const getAllProducts = async (
	page: string,
	q: string,
	sortBy: string,
	productStatus: string,
	brandFilter: string
) => {
	const products = await productRepo.getAllProducts(page, q, sortBy, productStatus, brandFilter);

	return products;
};

export const getSingleProduct = async (productId: string) => {
	const productResult = await productRepo.getSingleProductById(productId);

	const productReviews = await reviewRepo.getProductReviews(productId);

	return { productResult, productReviews };
};

export const createProduct = async (
	postData: any[],
	tags: string[],
	sizes: string[],
	images: Express.Multer.File[]
) => {
	const { productResult, tagResult, sizeResult } = await productRepo.createProduct(
		postData,
		tags,
		sizes
	);
	const newProductId = productResult.rows[0].id;

	// Upload images to google cloud storage
	const imagePromises: Promise<UploadResponse>[] = [];
	images.forEach(image => {
		imagePromises.push(
			bucket.upload(image.path, {
				destination: `products/product-${newProductId}-${image.filename}.jpeg`
			})
		);
	});

	const cloudImagesResponse = await Promise.all(imagePromises);

	const imagesResult = await productRepo.addProductImages(newProductId, cloudImagesResponse);

	const newProduct = {
		...productResult.rows[0],
		tags: tagResult,
		sizes: sizeResult,
		images: imagesResult
	};

	images.forEach(storedImage => fs.unlink(storedImage.path, () => {}));

	return newProduct;
};

export const updateProduct = async (
	updatedProductData: UpdateProductDataArgs,
	images: Express.Multer.File[]
) => {
	const { productResult, filteredUpdatedTags, filteredUpdatedSizes } =
		await productRepo.updateProduct(updatedProductData);
	const updatedProductId = productResult.rows[0].id;

	// Upload images to google cloud storage
	const imagePromises: Promise<UploadResponse>[] = [];
	images.forEach(image => {
		imagePromises.push(
			bucket.upload(image.path, {
				destination: `products/product-${updatedProductId}-${image.filename}.jpeg`
			})
		);
	});
	const cloudImagesResponse = await Promise.all(imagePromises);
	await productRepo.addProductImages(updatedProductId, cloudImagesResponse);

	// Delete image from local
	images.forEach(storedImage => fs.unlink(storedImage.path, () => {}));

	// Delete image from google cloud storage
	const deleteImagePromises: Promise<DeleteFileResponse>[] = [];
	updatedProductData.removedImages.forEach(url => {
		deleteImagePromises.push(
			bucket.file(url.replace("https://storage.googleapis.com/cloversy-store/", "")).delete()
		);
	});
	await Promise.all(imagePromises);

	// Remove images from DB
	await productRepo.removeProductImagesWithUrl(updatedProductId, updatedProductData.removedImages);

	// Retrieve updated product images list
	const imagesResult = await productRepo.getProductImages(updatedProductId);

	const updatedProduct = {
		...productResult.rows[0],
		tags: filteredUpdatedTags,
		sizes: filteredUpdatedSizes,
		images: imagesResult.rows.map(url => url)
	};

	return updatedProduct;
};

export const deleteProduct = async (productId: string) => {
	const result = await productRepo.deleteProduct(productId);

	return result;
};
