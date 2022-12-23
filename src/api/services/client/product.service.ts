// Data
import { productRepo } from "../../data/client";

export const getAllProducts = async (
	page: string,
	q: string,
	sortBy: string,
	brandFilter: string,
	count: string,
	priceFilter: string
) => {
	const products = await productRepo.getAllProducts(
		page,
		q,
		sortBy,
		brandFilter,
		count,
		priceFilter
	);

	const priceRange = await productRepo.getProductsPriceRange();

	return { products, priceRange };
};

export const getSingleProductBySlug = async (productSlug: string) => {
	const productResult = await productRepo.getSingleProductBySlug(productSlug);

	const productId = productResult.rows[0].id;
	const productTags = productResult.rows[0].tags;

	const recommendationsResult = await productRepo.getProductRecommendations(productTags, productId);

	return { productResult, recommendationsResult };
};

export const getUserLastSeenProducts = async (userId: string) => {
	const products = await productRepo.getUserLastSeenProducts(userId);

	return products;
};

export const trackUserLastSeenProduct = async (productId: string, userId: string) => {
	const lastSeenProductId = await productRepo.trackUserLastSeenProduct(productId, userId);

	return lastSeenProductId;
};
