// Data
import { reviewRepo } from "../data";

export const getTransactionReviews = async (transactionId: string) => {
	const reviews = await reviewRepo.getTransactionReviews(transactionId);

	return reviews;
};

export const getAllReviews = async (
	searchQuery: string,
	reviewStatus: string,
	sortBy: string,
	page: string,
	itemsLimit: string
) => {
	const reviews = await reviewRepo.getAllReviews(
		searchQuery,
		reviewStatus,
		sortBy,
		page,
		itemsLimit
	);

	return reviews;
};
