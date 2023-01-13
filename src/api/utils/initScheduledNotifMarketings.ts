// Utils
import scheduler from "./scheduler";

// Services
import { marketingService, notificationService } from "../services";
import { NotificationMessage } from "../interfaces";

const initScheduledNotifMarketings = async () => {
	// Get scheduled notif marketings
	const { notifMarketings } = await marketingService.getNotificationMarketings("", "", "true");

	let initialiedJobsCount = 0;
	for (const notifMarketing of notifMarketings) {
		const {
			scheduled,
			notification_code,
			send_to,
			message_title,
			message_body,
			image_url,
			action_link,
			action_title
		} = notifMarketing;
		const triggerAt = new Date(scheduled);

		// Decide notification targets
		let targets: string[] = [];
		if (send_to === "all") {
			targets = await notificationService.getAllUserNotificationTokens();
		}
		if (send_to === "selected") {
			const selectedUserIds = await marketingService.getNotifMarketingTargetUserIds(
				notifMarketing.id.toString()
			);

			targets = await notificationService.getUserNotificationTokens(selectedUserIds);
		}

		// Build message
		const notificationMessage: NotificationMessage = {
			title: message_title,
			body: message_body
		};
		if (image_url) notificationMessage.imageUrl = image_url;
		if (action_link) notificationMessage.actionLink = action_link;
		if (action_title) notificationMessage.actionTitle = action_title;

		// Schedule job
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
				notifMarketingId: notifMarketing.id
			});

			console.log(
				`Scheduled notification marketing #${notifMarketing.notification_code} successfully sent.`
			);
		});

		initialiedJobsCount += 1;
	}

	console.log(
		`Scheduled ${initialiedJobsCount} notification marketing ${
			initialiedJobsCount > 1 ? "jobs" : "job"
		}`
	);
};

export default initScheduledNotifMarketings;
