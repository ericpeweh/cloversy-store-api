// Data
import { reviewRepo } from "../data";

export const getTransactionReviews = async (transactionId: string) => {
	const reviews = await reviewRepo.getTransactionReviews(transactionId);

	return reviews;
};

export const getSingleReview = async (reviewId: string) => {
	const result = await reviewRepo.getSingleReview(reviewId);

	return result.rows[0];
};

export const getAllReviews = async (
	searchQuery: string,
	reviewStatus: string,
	sortBy: string,
	page: string,
	itemsLimit: string,
	transactionId: string
) => {
	const reviews = await reviewRepo.getAllReviews(
		searchQuery,
		reviewStatus,
		sortBy,
		page,
		itemsLimit,
		transactionId
	);

	return reviews;
};

export const updateReview = async (
	reviewId: string,
	rating: string,
	review: string,
	created_at: string,
	status: "active" | "disabled"
) => {
	await reviewRepo.updateReview(reviewId, rating, review, created_at, status);

	const updatedReview = await reviewRepo.getSingleReview(reviewId);

	return updatedReview.rows[0];
};
