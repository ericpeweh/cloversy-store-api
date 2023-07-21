// Dependencies
import { Request, Response, NextFunction } from "express";

// Types
import {
	CreateNotifMarketingData,
	NotificationMessage,
	UpdateNotifMarketingData
} from "../interfaces";

// Services
import { marketingService, notificationService, userService } from "../services";

// Utils
import { ErrorObj, scheduler } from "../utils";
import { scheduledJobs } from "../utils/scheduler";

export const createNotificationMarketing = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {
		title,
		description,
		scheduled = null,
		selectedUserIds = [],
		message_title,
		message_body,
		image_url,
		deeplink_url,
		action_link,
		action_title,
		sendTo
	} = req.body;

	const newNotifMarketingData: CreateNotifMarketingData = {
		title,
		description,
		scheduled,
		message_title,
		message_body,
		image_url,
		deeplink_url,
		action_link,
		action_title,
		send_to: sendTo
	};

	try {
		if (sendTo === "selected" && selectedUserIds.length === 0) {
			throw new ErrorObj.ClientError(
				"Selected users can't be empty if sendTo is set to 'selected'."
			);
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
		if (deeplink_url) notificationMessage.deeplinkUrl = deeplink_url;
		if (action_link) notificationMessage.actionLink = action_link;
		if (action_title) notificationMessage.actionTitle = action_title;

		let notificationResult;
		let directNotifSent = false;
		if (!scheduled) {
			// Send notification directly
			notificationResult = await notificationService.sendNotifications(
				notificationMessage,
				targets,
				{ removeFailedTokens: true }
			);

			directNotifSent = true;

			console.log("Direct notification marketing successfully sent.");
		}

		const newNotifMarketing = await marketingService.createNotificationMarketing(
			newNotifMarketingData,
			selectedUserIds,
			notificationResult
		);

		if (directNotifSent) {
			// Store notification to admins
			const adminUserIds = await userService.getAllAdminUserIds();
			const notificationItem = {
				title: "Marketing notifikasi direct telah dikirim",
				description: `Marketing notifikasi #${newNotifMarketing.notification_code} berhasil dikirim.`,
				category_id: 2, // = marketing category
				action_link: `https://admin.cloversy.id/marketing/notification/${newNotifMarketing.id}`
			};
			await notificationService.storeNotification(adminUserIds, notificationItem);
		}

		// Schedule notification trigger if new notif marketing is scheduled type
		if (scheduled) {
			const triggerAt = new Date(scheduled);

			scheduler.scheduleJob(newNotifMarketing.notification_code, triggerAt, async () => {
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
					notifMarketingId: newNotifMarketing.id
				});

				// Store notification to admins
				const adminUserIds = await userService.getAllAdminUserIds();
				const notificationItem = {
					title: "Marketing notifikasi terjadwal telah dikirim",
					description: `Marketing notifikasi #${newNotifMarketing.notification_code} berhasil dikirim.`,
					category_id: 2, // = marketing category
					action_link: `https://admin.cloversy.id/marketing/notification/${newNotifMarketing.id}`
				};
				await notificationService.storeNotification(adminUserIds, notificationItem);

				console.log(
					`Scheduled notification marketing #${newNotifMarketing.notification_code} successfully sent.`
				);
			});
		}

		res.status(201).json({
			status: "success",
			data: { newNotifMarketing }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getNotificationMarketings = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { page = "1", q: searchQuery = "", scheduled = "false" } = req.query;

	try {
		const { notifMarketings, ...paginationData } = await marketingService.getNotificationMarketings(
			page as string,
			searchQuery as string,
			scheduled as "true" | "false"
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { notifMarketings }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getNotificationMarketingDetail = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { notifMarketingId } = req.params;

	try {
		const result = await marketingService.getNotificationMarketingDetail(notifMarketingId);

		res.status(200).json({
			status: "success",
			data: { notifMarketing: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateNotificationMarketing = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {
		title,
		description,
		scheduled = null,
		selectedUserIds = [],
		removedUserIds = [],
		message_title,
		message_body,
		image_url,
		deeplink_url,
		action_link,
		action_title,
		sendTo
	} = req.body;

	const { notifMarketingId } = req.params;

	try {
		const notificationMarketingItem = await marketingService.getNotificationMarketingDetail(
			notifMarketingId
		);

		let updatedNotifMarketingData: Partial<UpdateNotifMarketingData>;
		if (notificationMarketingItem?.sent_at) {
			// Handle update for already sent notification marketing
			updatedNotifMarketingData = {
				title,
				description
			};
		} else {
			// Handle scheduled / expired notification marketing
			updatedNotifMarketingData = {
				title,
				description,
				scheduled,
				message_title,
				message_body,
				image_url,
				deeplink_url,
				action_link,
				action_title,
				send_to: sendTo
			};
		}

		// Update notification marketing
		const updatedNotifMarketing = await marketingService.updateNotificationMarketing(
			{
				updatedNotifMarketingData,
				notifMarketingId
			},
			selectedUserIds,
			removedUserIds
		);

		// Reschedule notification marketing if condition is fulfilled
		if (!updatedNotifMarketing?.sent_at && updatedNotifMarketing?.scheduled) {
			await marketingService.scheduleNotifMarketingNotification(updatedNotifMarketing.id, {
				reschedule: true
			});
		}

		const updatedNotifMarketingDetail = await marketingService.getNotificationMarketingDetail(
			notifMarketingId
		);

		res.status(200).json({
			status: "success",
			data: { updatedNotifMarketing: updatedNotifMarketingDetail }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const cancelNotificationMarketing = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { notifMarketingId } = req.params;

	try {
		// Get notif marketing item & check if exist
		const notificationMarketingItem = await marketingService.getNotificationMarketingDetail(
			notifMarketingId
		);

		if (notificationMarketingItem?.sent_at)
			throw new ErrorObj.ClientError("Can't cancel already sent notification marketing!");

		// Cancel notification marketing
		const updatedNotifMarketing = await marketingService.updateNotificationMarketing({
			updatedNotifMarketingData: { canceled: true },
			notifMarketingId
		});

		// Cancel notification marketing scheduled task
		if (updatedNotifMarketing.notification_code) {
			const job = scheduledJobs ? scheduledJobs[updatedNotifMarketing.notification_code] : null;
			if (job) {
				job.cancel();
			}
		}

		res.status(200).json({
			status: "success",
			data: { canceledNotifMarketingId: updatedNotifMarketing.id }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
