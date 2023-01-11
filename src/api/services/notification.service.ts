// Data
import { notificationRepo } from "../data";

// Types
import { MulticastMessage } from "firebase-admin/messaging";
import {
	NotificationMessage,
	UpdateNotifMarketingDataArgs
} from "../interfaces/notification.interface";

// Config
import fcm from "../../config/firebase";

// Utils
import { ErrorObj, getLocalTime } from "../utils";

export const sendNotifications = async (message: NotificationMessage, target: string[]) => {
	const failedTokens: string[] = [];
	let successCount = 0;
	let failureCount = 0;

	// Handle send notification if tokens > 500
	// Splitting token for equal size (max 500)
	// FCM support multicast to max 500 targets
	for (let i = 0; i < target.length; i += 500) {
		const selectedTargets = target.slice(i, i + 500);
		const test: MulticastMessage = {
			data: message as unknown as { [key: string]: string },
			tokens: selectedTargets
		};

		const res = await fcm.sendMulticast(test);

		successCount += res.successCount;
		failureCount += res.failureCount;

		if (res.failureCount > 0) {
			// Get all failed tokens if exist
			res.responses.forEach((resp, i) => {
				if (!resp.success) {
					failedTokens.push(selectedTargets[i]);
				}
			});
		}
	}

	return { failedTokens, successCount, failureCount, sendAt: getLocalTime() };

	// Delete failed token from DB if 400 or 404

	// Update notification_marketing data
	// UPDATE REPO HERE
};

export const removeNotificationTokens = async (tokens: string[]) => {
	await notificationRepo.removeNotificationTokens(tokens);
};

export const updateNotificationMarketing = async (data: UpdateNotifMarketingDataArgs) => {
	const { notifMarketingId } = data;

	const notifMarketingItem = await notificationRepo.getSingleNotificationMarketing(
		notifMarketingId
	);

	if (!notifMarketingItem) throw new ErrorObj.ClientError("Notification marketing not found!", 404);

	await notificationRepo.updateNotificationMarketing(data);
};

export const getUserNotificationTokens = async (userIds: string[] | number[]) => {
	const tokens = await notificationRepo.getUserNotificationTokens(userIds);

	return tokens;
};

export const getAdminNotificationTokens = async () => {
	const tokens = await notificationRepo.getAdminNotificationTokens();

	return tokens;
};
