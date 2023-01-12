// Data
import { notificationRepo } from "../data";

// Types
import { MulticastMessage } from "firebase-admin/messaging";
import { NotificationMessage, SendNotificationResult } from "../interfaces";

// Config
import fcm from "../../config/firebase";

// Utils
import { getLocalTime } from "../utils";

export const sendNotifications = async (
	message: NotificationMessage,
	target: string[],
	options?: {
		removeFailedTokens?: boolean;
	}
): Promise<SendNotificationResult> => {
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

	if (options?.removeFailedTokens) {
		await notificationRepo.removeNotificationTokens(failedTokens);
	}

	return { failedTokens, successCount, failureCount, sendAt: getLocalTime() };
};

export const removeNotificationTokens = async (tokens: string[]) => {
	await notificationRepo.removeNotificationTokens(tokens);
};

export const getUserNotificationTokens = async (userIds: string[] | number[]) => {
	const tokens = await notificationRepo.getUserNotificationTokens(userIds);

	return tokens;
};

export const getAdminNotificationTokens = async () => {
	const tokens = await notificationRepo.getAdminNotificationTokens();

	return tokens;
};

export const getAllUserNotificationTokens = async () => {
	const tokens = await notificationRepo.getAllUserNotificationTokens();

	return tokens;
};
