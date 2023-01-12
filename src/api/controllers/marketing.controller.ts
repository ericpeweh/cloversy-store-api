// Dependencies
import { Request, Response } from "express";

// Types
import { CreateNotifMarketingData, NotificationMessage } from "../interfaces";

// Services
import { marketingService, notificationService } from "../services";

// Utils
import { ErrorObj, scheduler } from "../utils";

export const createNotificationMarketing = async (req: Request, res: Response) => {
	const {
		title,
		code,
		description,
		scheduled = null,
		selectedUserIds = [],
		message_title,
		message_body,
		image_url,
		action_link,
		action_title,
		sendTo
	} = req.body;

	const newNotifMarketingData: CreateNotifMarketingData = {
		title,
		code,
		description,
		scheduled,
		message_title,
		message_body,
		image_url,
		action_link,
		action_title
	};

	try {
		if (!["all", "selected"].includes(sendTo)) {
			throw new ErrorObj.ClientError("Invalid marketing targets data!");
		}

		if (sendTo === "selected" && selectedUserIds.length === 0) {
			throw new ErrorObj.ClientError("Selected users can't be if sendTo is set to 'selected'.");
		}

		// Decide notification targets
		let targets: string[] = [];
		if (sendTo === "all") {
			targets = await notificationService.getAllUserNotificationTokens();
		}
		if (sendTo === "selected") {
			targets = await notificationService.getUserNotificationTokens(selectedUserIds);
		}

		// Handle direct and scheduled notification marketing
		const notificationMessage: NotificationMessage = {
			title: message_title,
			body: message_body
		};
		if (image_url) notificationMessage.imageUrl = image_url;
		if (action_link) notificationMessage.actionLink = action_link;
		if (action_title) notificationMessage.actionTitle = action_title;

		let notificationResult;
		if (!scheduled) {
			// Send notification directly
			notificationResult = await notificationService.sendNotifications(
				notificationMessage,
				targets,
				{ removeFailedTokens: true }
			);
		}

		const newNotifMarketing = await marketingService.createNotificationMarketing(
			newNotifMarketingData,
			selectedUserIds,
			notificationResult
		);

		// Schedule notification trigger if new notif marketing is scheduled type
		if (scheduled) {
			const triggerAt = new Date(scheduled);

			const job = scheduler.scheduleJob(triggerAt, async () => {
				const { successCount, failureCount, sendAt } = await notificationService.sendNotifications(
					notificationMessage,
					targets,
					{ removeFailedTokens: true }
				);

				// Update notification marketing
				await marketingService.updateNotificationMarketing({
					updatedNotifMarketingData: {
						failure_count: failureCount,
						success_count: successCount,
						sent_at: sendAt
					},
					notifMarketingId: newNotifMarketing.id
				});
			});

			console.log("SCHEDULED: ", job);
		}

		res.status(200).json({
			status: "success",
			data: { newNotifMarketing }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
