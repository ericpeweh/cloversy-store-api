// Data
import { subscriptionRepo } from "../data";

export const getPushSubscriptions = async (page: string, searchQuery: string) => {
	const result = await subscriptionRepo.getPushSubscriptions(page, searchQuery);

	return result;
};

export const deleteExpiredTokens = async () => {
	const deletedTokensCount = await subscriptionRepo.deleteExpiredTokens();

	return deletedTokensCount;
};
