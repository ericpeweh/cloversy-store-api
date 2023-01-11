// Data
import { subscriptionRepo } from "../../data/client";
import { ErrorObj } from "../../utils";

export const subscribeToEmail = async (email: string) => {
	const subscribedEmail = await subscriptionRepo.subscribeToEmail(email);

	return subscribedEmail;
};

export const unsubscribeFromEmail = async (email: string) => {
	const unsubscribedEmail = await subscriptionRepo.unsubscribeFromEmail(email);

	return unsubscribedEmail;
};

export const subscribeToPush = async (token: string, userId: string) => {
	const subscriptionId = await subscriptionRepo.subscribeToPush(token, userId);

	return subscriptionId;
};

export const unsubscribeFromPush = async (subscriptionId: number, userId: string) => {
	const subscription = await subscriptionRepo.getSingleUserSubscription(subscriptionId, userId);

	if (!subscription) throw new ErrorObj.ClientError("Subscription not found!", 404);

	if (subscription.user_id.toString() !== userId)
		throw new ErrorObj.ClientError("You're not authorized!", 403);

	await subscriptionRepo.unsubscribeFromPush(subscriptionId);
};
