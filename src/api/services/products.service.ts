// Data
import { productRepo } from "../data";

// Types
import { UpdateProductDataArgs } from "../interfaces";

export const getAllProducts = async () => {
	const products = await productRepo.getAllProducts();

	return products;
};

export const getSingleProduct = async (productId: string, productSlug: string) => {
	const { productResult, filteredTags, filteredSizes } = await productRepo.getSingleProduct(
		productId,
		productSlug
	);

	const product = {
		...productResult.rows[0],
		tags: filteredTags,
		sizes: filteredSizes
	};

	return product;
};

export const createProduct = async (postData: any[], tags: string[], sizes: string[]) => {
	const { productResult, tagResult, sizeResult } = await productRepo.createProduct(
		postData,
		tags,
		sizes
	);

	const newProduct = {
		...productResult.rows[0],
		tags: tagResult,
		sizes: sizeResult
	};

	return newProduct;
};

export const updateProduct = async (updatedProductData: UpdateProductDataArgs) => {
	const { productResult, filteredUpdatedTags, filteredUpdatedSizes } =
		await productRepo.updateProduct(updatedProductData);

	const updatedProduct = {
		...productResult.rows[0],
		tags: filteredUpdatedTags,
		sizes: filteredUpdatedSizes
	};

	return updatedProduct;
};

export const deleteProduct = async (productId: string) => {
	const result = await productRepo.deleteProduct(productId);

	return result;
};
