// Dependencies
import sendinblueSDK from "sib-api-v3-sdk";

// Data
import { marketingRepo, notificationRepo, subscriptionRepo } from "../data";

// Utils
import { ErrorObj, getLocalTime, isDateBeforeCurrentTime, scheduler } from "../utils";
import { scheduledJobs } from "../utils/scheduler";

// Config
import sendinblue from "../../config/sendinblue";

// Services
import { marketingService, notificationService, userService } from ".";

// Types
import {
	CreateEmailMarketingData,
	CreateNotifMarketingData,
	EmailObject,
	EmailTemplate,
	NotificationMessage,
	NotificationSubscription,
	SendEmailResult,
	SendNotificationResult,
	UpdateEmailMarketingDataArgs,
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
		deeplink_url,
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
		if (deeplink_url) notificationMessage.deeplinkUrl = deeplink_url;
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

				// Store notification to admins
				const adminUserIds = await userService.getAllAdminUserIds();
				const notificationItem = {
					title: "Marketing notifikasi terjadwal telah dikirim",
					description: `Marketing notifikasi #${notification_code} berhasil dikirim.`,
					category_id: 2, // = marketing category
					action_link: `http://localhost:3001/marketing/notification/${notifMarketingId}`
				};
				await notificationService.storeNotification(adminUserIds, notificationItem);

				console.log(`Scheduled notification marketing #${notification_code} successfully sent.`);
			});
		}
	}
};

export const getEmailsTemplate = async () => {
	const options = {
		templateStatus: true
	};

	let emailsTemplate: EmailTemplate[] = [];
	try {
		emailsTemplate = (await sendinblue.getSmtpTemplates(options)).templates;
	} catch (error) {
		throw new ErrorObj.ServerError("Failed to get email templates");
	}

	return emailsTemplate;
};

export const getSingleEmailTemplate = async (templateId: number | string) => {
	if (!templateId) throw new ErrorObj.ClientError("Invalid email template id!");

	const template: EmailTemplate = await sendinblue.getSmtpTemplate(templateId);

	return template;
};

export const getEmailMarketings = async (
	page: string,
	searchQuery: string,
	scheduled: "true" | "false"
) => {
	const result = await marketingRepo.getEmailMarketings(page, searchQuery, scheduled);

	return result;
};

export const getEmailMarketingDetail = async (emailMarketingId: string) => {
	const { emailMarketingResult, selectedUsers } = await marketingRepo.getEmailMarketingDetail(
		emailMarketingId
	);

	return { ...emailMarketingResult.rows[0], selectedUsers };
};

export const sendEmails = async (email: EmailObject): Promise<SendEmailResult> => {
	const failedEmails: string[] = [];
	let successCount = 0;
	let failureCount = 0;

	const sendSmtpEmail = new sendinblueSDK.SendSmtpEmail();

	const { to, params, templateId } = email;

	for (const target of to) {
		params.full_name = target.name === target.email ? "Clovers" : target.name;

		sendSmtpEmail.to = [target];
		sendSmtpEmail.params = params;
		sendSmtpEmail.templateId = templateId;

		try {
			await sendinblue.sendTransacEmail(sendSmtpEmail);
			successCount += 1;
		} catch (error) {
			console.log("Failed to send email", error);
			failedEmails.push(target.email);
			failureCount += 1;
		}
	}

	return { failedEmails, successCount, failureCount, sendAt: getLocalTime() };
};

export const createEmailMarketing = async (
	newEmailMarketingData: CreateEmailMarketingData,
	selectedUserIds: string[],
	emailResult: SendEmailResult | undefined
) => {
	const result = await marketingRepo.createEmailMarketing(
		newEmailMarketingData,
		selectedUserIds,
		emailResult
	);

	return result;
};

export const updateEmailMarketing = async (
	data: UpdateEmailMarketingDataArgs,
	selectedUserIds?: string[] | number[],
	removedUserIds?: string[] | number[]
) => {
	const { emailMarketingId } = data;

	// Get current notification marketing
	const emailMarketingItem = await marketingRepo.getSingleEmailMarketing(emailMarketingId);

	if (!emailMarketingItem) throw new ErrorObj.ClientError("Email marketing not found!", 404);

	const result = await marketingRepo.updateEmailMarketing(data, selectedUserIds, removedUserIds);

	return result;
};

export const getEmailMarketingTargetUserIds = async (emailMarketingId: string | number) => {
	const selectedUserIds = await marketingRepo.getEmailMarketingTargetUserIds(emailMarketingId);

	return selectedUserIds;
};

export const scheduleEmailMarketing = async (
	emailMarketingId: string | number,
	options?: { reschedule?: boolean }
) => {
	const { emailMarketingResult } = await marketingRepo.getEmailMarketingDetail(emailMarketingId);
	const { email_subject, scheduled, notification_code, params, template_id } =
		emailMarketingResult.rows[0];

	if (scheduled) {
		const emailParams = params;
		emailParams["email_subject"] = email_subject; // Add email_subject as params

		// Get email marketing targets
		const selectedUserIds = await marketingService.getEmailMarketingTargetUserIds(emailMarketingId);

		const targets = await userService.getUserEmailAndNameByIds(selectedUserIds);

		// Build email
		const emailObject: EmailObject = {
			to: targets.map(({ full_name, email }) => ({
				email,
				name: full_name
			})),
			templateId: +template_id,
			params: emailParams
		};

		const triggerAt = new Date(scheduled);

		// Cancel any scheduled email marketing if action is rescheduling
		if (options?.reschedule) {
			const job = scheduledJobs[notification_code];
			if (job) {
				job.cancel();
			}
		}

		// Schedule notification if scheduled date is not expired
		if (!isDateBeforeCurrentTime(scheduled)) {
			scheduler.scheduleJob(notification_code, triggerAt, async () => {
				const { successCount, failureCount, sendAt, failedEmails } =
					await marketingService.sendEmails(emailObject);

				// Update notification marketing
				await marketingService.updateEmailMarketing({
					updatedEmailMarketingData: {
						failure_count: failureCount,
						success_count: successCount,
						failed_emails: failedEmails,
						sent_at: sendAt
					},
					emailMarketingId: emailMarketingId
				});

				// Store notification to admins
				const adminUserIds = await userService.getAllAdminUserIds();
				const notificationItem = {
					title: "Marketing email terjadwal telah dikirim",
					description: `Marketing email #${notification_code} berhasil dikirim.`,
					category_id: 2, // = marketing category
					action_link: `http://localhost:3001/marketing/email/${emailMarketingId}`
				};
				await notificationService.storeNotification(adminUserIds, notificationItem);

				console.log(`Scheduled email marketing #${notification_code} successfully sent.`);
			});
		}
	}
};
