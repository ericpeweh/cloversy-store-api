// Data
import { reviewRepo } from "../data";

export const getTransactionReviews = async (transactionId: string) => {
	const reviews = await reviewRepo.getTransactionReviews(transactionId);

	return reviews;
};
