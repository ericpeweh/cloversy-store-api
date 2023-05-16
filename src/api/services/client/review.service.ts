// Data
import { reviewRepo } from "../../data/client";

// Types
import { ReviewRequestItem } from "../../interfaces";

export const getProductReviews = async (productId: string) => {
	const reviews = await reviewRepo.getProductReviews(productId);

	return reviews;
};

export const createReviews = async (
	userId: string,
	transactionId: string,
	reviews: ReviewRequestItem[]
) => {
	await reviewRepo.createReviews(userId, transactionId, reviews);

	return transactionId;
};
