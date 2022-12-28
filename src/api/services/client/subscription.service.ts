// Data
import { subscriptionRepo } from "../../data/client";

export const subscribeToEmail = async (email: string) => {
	const subscribedEmail = await subscriptionRepo.subscribeToEmail(email);

	return subscribedEmail;
};

export const unsubscribeFromEmail = async (email: string) => {
	const unsubscribedEmail = await subscriptionRepo.unsubscribeFromEmail(email);

	return unsubscribedEmail;
};
