// Data
import { marketingRepo, notificationRepo, subscriptionRepo } from "../data";

// Utils
import { ErrorObj, isDateBeforeCurrentTime, scheduler } from "../utils";
import { scheduledJobs } from "../utils/scheduler";

// Types
import {
	CreateNotifMarketingData,
	NotificationMessage,
	NotificationSubscription,
	SendNotificationResult,
	UpdateNotifMarketingDataArgs
} from "../interfaces";
import { marketingService, notificationService } from ".";

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

export const updateNotificationMarketing = async (
	data: UpdateNotifMarketingDataArgs,
	selectedUserIds?: string[] | number[],
	removedUserIds?: string[] | number[]
) => {
	const {
		notifMarketingId,
		updatedNotifMarketingData: { send_to }
	} = data;

	// Get current notification marketing
	const notifMarketingItem = await notificationRepo.getSingleNotificationMarketing(
		notifMarketingId
	);

	if (!notifMarketingItem) throw new ErrorObj.ClientError("Notification marketing not found!", 404);

	// Get Notif subscriptions
	let notifSubscriptions: NotificationSubscription[] = [];

	if (send_to === "selected" && selectedUserIds && selectedUserIds.length > 0) {
		notifSubscriptions = await subscriptionRepo.getNotifSubscriptionsByUserIds(selectedUserIds);
	}

	if (send_to === "all") {
		notifSubscriptions = await subscriptionRepo.getAllNotifSubscriptions();
	}

	const result = await marketingRepo.updateNotificationMarketing(
		data,
		notifMarketingItem,
		notifSubscriptions,
		selectedUserIds,
		removedUserIds
	);

	return result;
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

export const getNotifMarketingTargetUserIds = async (notifMarketingId: string | number) => {
	const selectedUserIds = await marketingRepo.getNotifMarketingTargetUserIds(notifMarketingId);

	return selectedUserIds;
};

export const scheduleNotifMarketingNotification = async (
	notifMarketingId: string | number,
	options?: { reschedule?: boolean }
) => {
	const { notifMarketingResult } = await marketingRepo.getNotificationMarketingDetail(
		notifMarketingId
	);
	const {
		message_title,
		message_body,
		scheduled,
		image_url,
		action_link,
		action_title,
		notification_code,
		send_to
	} = notifMarketingResult.rows[0];

	if (scheduled) {
		// Build message
		const notificationMessage: NotificationMessage = {
			title: message_title,
			body: message_body
		};
		if (image_url) notificationMessage.imageUrl = image_url;
		if (action_link) notificationMessage.actionLink = action_link;
		if (action_title) notificationMessage.actionTitle = action_title;

		const triggerAt = new Date(scheduled);

		// Decide notification targets
		let targets: string[] = [];
		if (send_to === "all") {
			targets = await notificationService.getAllUserNotificationTokens();
		}
		if (send_to === "selected") {
			const selectedUserIds = await marketingService.getNotifMarketingTargetUserIds(
				notifMarketingId
			);

			targets = await notificationService.getUserNotificationTokens(selectedUserIds);
		}

		// Cancel any scheduled if action is rescheduling
		if (options?.reschedule) {
			const job = scheduledJobs[notification_code];
			if (job) {
				job.cancel();
			}
		}

		// Schedule notification if scheduled date is not expired
		if (!isDateBeforeCurrentTime(scheduled)) {
			scheduler.scheduleJob(notification_code, triggerAt, async () => {
				const { successCount, failureCount, sendAt } = await notificationService.sendNotifications(
					notificationMessage,
					targets,
					{
						removeFailedTokens: true
					}
				);

				// Update notification marketing
				await marketingService.updateNotificationMarketing({
					updatedNotifMarketingData: {
						failure_count: failureCount,
						success_count: successCount,
						sent_at: sendAt
					},
					notifMarketingId
				});

				console.log(`Scheduled notification marketing #${notification_code} successfully sent.`);
			});
		}
	}
};
