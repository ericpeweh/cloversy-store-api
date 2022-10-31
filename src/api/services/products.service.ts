// Data
import data from "../data";

// Types
import { ProductType } from "../interfaces";

export const getAllProducts = async () => {
	const products = await data.getAllProducts();

	return products;
};

export const createProduct = async (postData: any[]) => {
	const newProduct = await data.createProduct(postData);

	return newProduct;
};

export default {
	getAllProducts,
	createProduct
};
