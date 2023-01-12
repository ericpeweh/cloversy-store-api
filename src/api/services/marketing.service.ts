// Data
import { marketingRepo, notificationRepo, subscriptionRepo } from "../data";

// Utils
import { ErrorObj } from "../utils";

// Types
import {
	CreateNotifMarketingData,
	NotificationSubscription,
	SendNotificationResult,
	UpdateNotifMarketingDataArgs
} from "../interfaces";

export const createNotificationMarketing = async (
	newNotifMarketingData: CreateNotifMarketingData,
	selectedUserIds: string[],
	notificationResult: SendNotificationResult | undefined
) => {
	let notifSubscriptions: NotificationSubscription[] = [];
	if (selectedUserIds.length > 0) {
		notifSubscriptions = await subscriptionRepo.getNotifSubscriptionsByUserIds(selectedUserIds);
	}

	const result = await marketingRepo.createNotificationMarketing(
		newNotifMarketingData,
		notifSubscriptions,
		notificationResult
	);

	return result;
};

export const updateNotificationMarketing = async (data: UpdateNotifMarketingDataArgs) => {
	const { notifMarketingId } = data;

	const notifMarketingItem = await notificationRepo.getSingleNotificationMarketing(
		notifMarketingId
	);

	if (!notifMarketingItem) throw new ErrorObj.ClientError("Notification marketing not found!", 404);

	const result = await notificationRepo.updateNotificationMarketing(data);

	return result.rows[0];
};
