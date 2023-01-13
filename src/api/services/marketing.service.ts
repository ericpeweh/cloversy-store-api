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
	const { send_to } = newNotifMarketingData;

	if (send_to === "selected" && selectedUserIds.length > 0) {
		notifSubscriptions = await subscriptionRepo.getNotifSubscriptionsByUserIds(selectedUserIds);
	}

	if (send_to === "all") {
		notifSubscriptions = await subscriptionRepo.getAllNotifSubscriptions();
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

	const result = await marketingRepo.updateNotificationMarketing(data);

	return result.rows[0];
};

export const getNotificationMarketings = async (
	page: string,
	searchQuery: string,
	scheduled: "true" | "false"
) => {
	const result = await marketingRepo.getNotificationMarketings(page, searchQuery, scheduled);

	return result;
};

export const getNotificationMarketingDetail = async (notifMarketingId: string) => {
	const { notifMarketingResult, selectedUsers } =
		await marketingRepo.getNotificationMarketingDetail(notifMarketingId);

	return { ...notifMarketingResult.rows[0], selectedUsers };
};

export const getNotifMarketingTargetUserIds = async (notifMarketingId: string) => {
	const selectedUserIds = await marketingRepo.getNotifMarketingTargetUserIds(notifMarketingId);

	return selectedUserIds;
};
