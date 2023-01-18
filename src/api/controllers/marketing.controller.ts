// Dependencies
import { Request, Response } from "express";

// Types
import {
	CreateEmailMarketingData,
	CreateNotifMarketingData,
	EmailObject,
	NotificationMessage,
	UpdateEmailMarketingData,
	UpdateNotifMarketingData
} from "../interfaces";

// Services
import { marketingService, notificationService, userService } from "../services";

// Utils
import { ErrorObj, getEmailTemplateParams, getLocalTime, scheduler } from "../utils";

export const createNotificationMarketing = async (req: Request, res: Response) => {
	const {
		title,
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
		description,
		scheduled,
		message_title,
		message_body,
		image_url,
		action_link,
		action_title,
		send_to: sendTo
	};

	try {
		if (!["all", "selected"].includes(sendTo)) {
			throw new ErrorObj.ClientError("Invalid marketing targets data!");
		}

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
		if (action_link) notificationMessage.actionLink = action_link;
		if (action_title) notificationMessage.actionTitle = action_title;

		let notificationResult;
		let directNotifSent: boolean = false;
		if (!scheduled) {
			// Send notification directly
			notificationResult = await notificationService.sendNotifications(
				notificationMessage,
				targets,
				{ removeFailedTokens: true }
			);

			directNotifSent = true;

			console.log(`Direct notification marketing successfully sent.`);
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
				action_link: `http://localhost:3001/marketing/notification/${newNotifMarketing.id}`
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
					action_link: `http://localhost:3001/marketing/notification/${newNotifMarketing.id}`
				};
				await notificationService.storeNotification(adminUserIds, notificationItem);

				console.log(
					`Scheduled notification marketing #${newNotifMarketing.notification_code} successfully sent.`
				);
			});
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

export const getNotificationMarketings = async (req: Request, res: Response) => {
	const { page = "1", q: searchQuery = "", scheduled = "false" } = req.query;

	try {
		if (
			typeof page !== "string" ||
			typeof searchQuery !== "string" ||
			typeof scheduled !== "string"
		) {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (scheduled !== "true" && scheduled !== "false")
			throw new ErrorObj.ClientError(
				"Query param of 'scheduled' should be either 'true' or 'false'"
			);

		const { notifMarketings, ...paginationData } = await marketingService.getNotificationMarketings(
			page,
			searchQuery,
			scheduled
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { notifMarketings }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getNotificationMarketingDetail = async (req: Request, res: Response) => {
	const { notifMarketingId } = req.params;

	try {
		if (!notifMarketingId) throw new ErrorObj.ClientError("Invalid notification marketing id!");

		const result = await marketingService.getNotificationMarketingDetail(notifMarketingId);

		res.status(200).json({
			status: "success",
			data: { notifMarketing: result }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateNotificationMarketing = async (req: Request, res: Response) => {
	const {
		title,
		description,
		scheduled = null,
		selectedUserIds = [],
		removedUserIds = [],
		message_title,
		message_body,
		image_url,
		action_link,
		action_title,
		sendTo
	} = req.body;
	const { notifMarketingId } = req.params;

	try {
		if (!notifMarketingId) throw new ErrorObj.ClientError("Invalid notification marketing id!");

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
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const cancelNotificationMarketing = async (req: Request, res: Response) => {
	const { notifMarketingId } = req.params;

	try {
		if (!notifMarketingId) throw new ErrorObj.ClientError("Invalid notification marketing id!");

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

		res.status(200).json({
			status: "success",
			data: { canceledNotifMarketingId: updatedNotifMarketing.id }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getEmailsTemplate = async (_: Request, res: Response) => {
	try {
		const result = await marketingService.getEmailsTemplate();

		const structuredResult = result.map(template => {
			const params = getEmailTemplateParams(template.htmlContent);

			return { ...template, params };
		});

		res.status(200).json({
			status: "success",
			data: { emailsTemplate: structuredResult }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getEmailMarketings = async (req: Request, res: Response) => {
	const { page = "1", q: searchQuery = "", scheduled = "false" } = req.query;

	try {
		if (
			typeof page !== "string" ||
			typeof searchQuery !== "string" ||
			typeof scheduled !== "string"
		) {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (scheduled !== "true" && scheduled !== "false")
			throw new ErrorObj.ClientError(
				"Query param of 'scheduled' should be either 'true' or 'false'"
			);

		const { emailMarketings, ...paginationData } = await marketingService.getEmailMarketings(
			page,
			searchQuery,
			scheduled
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { emailMarketings }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getEmailMarketingDetail = async (req: Request, res: Response) => {
	const { emailMarketingId } = req.params;

	try {
		if (!emailMarketingId) throw new ErrorObj.ClientError("Invalid email marketing id!");

		const result = await marketingService.getEmailMarketingDetail(emailMarketingId);

		res.status(200).json({
			status: "success",
			data: { emailMarketing: result }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const createEmailMarketing = async (req: Request, res: Response) => {
	const {
		title,
		description,
		scheduled = null,
		selectedUserIds = [],
		email_subject,
		params,
		sendTo,
		templateId
	} = req.body;

	const newEmailMarketingData: CreateEmailMarketingData = {
		title,
		description,
		scheduled,
		email_subject,
		params,
		send_to: sendTo,
		template_id: templateId,
		send_at: null
	};

	try {
		if (sendTo !== "selected") {
			throw new ErrorObj.ClientError("Invalid marketing targets data!");
		}

		if (selectedUserIds.length === 0) {
			throw new ErrorObj.ClientError("Selected users can't be empty");
		}

		if (selectedUserIds.length > 100) {
			throw new ErrorObj.ClientError("Maximum selected users exceeded (max 100 users).");
		}

		const targets = await userService.getUserEmailAndNameByIds(selectedUserIds);

		// Check email template exist & it params
		const emailTemplate = await marketingService.getSingleEmailTemplate(templateId);

		// Remove full_name as required params since it is added automatically
		const templateParams = getEmailTemplateParams(emailTemplate.htmlContent).filter(
			param => param !== "full_name"
		);

		templateParams.push("email_subject"); // Add email subject as required param

		const emailParams = params;
		emailParams["email_subject"] = email_subject; // Add email_subject as params

		// Validate every params is provided
		if (!templateParams.every(param => Boolean(emailParams[param])))
			throw new ErrorObj.ClientError("Invalid params, make sure to provide all params.");

		// Build email
		const emailObject: EmailObject = {
			to: targets.map(({ full_name, email }) => ({
				email,
				name: full_name
			})),
			templateId,
			params: emailParams
		};

		// Handle direct and scheduled email marketing
		let emailResult;
		let directNotifSent: boolean = false;
		if (!scheduled) {
			// Send email directly
			emailResult = await marketingService.sendEmails(emailObject);

			directNotifSent = true;

			console.log(`Direct email marketing successfully sent.`);
		}

		const newEmailMarketing = await marketingService.createEmailMarketing(
			newEmailMarketingData,
			selectedUserIds,
			emailResult
		);

		if (directNotifSent) {
			// Store notification to admins
			const adminUserIds = await userService.getAllAdminUserIds();
			const notificationItem = {
				title: "Marketing email direct telah dikirim",
				description: `Marketing email #${newEmailMarketing.notification_code} berhasil dikirim.`,
				category_id: 2, // = marketing category
				action_link: `http://localhost:3001/marketing/email/${newEmailMarketing.id}`
			};
			await notificationService.storeNotification(adminUserIds, notificationItem);
		}

		// Schedule notification trigger if new email marketing is scheduled type
		if (scheduled) {
			const triggerAt = new Date(scheduled);

			scheduler.scheduleJob(newEmailMarketing.notification_code, triggerAt, async () => {
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
					emailMarketingId: newEmailMarketing.id
				});

				// Store notification to admins
				const adminUserIds = await userService.getAllAdminUserIds();
				const notificationItem = {
					title: "Marketing email terjadwal telah dikirim",
					description: `Marketing email #${newEmailMarketing.notification_code} berhasil dikirim.`,
					category_id: 2, // = marketing category
					action_link: `http://localhost:3001/marketing/email/${newEmailMarketing.id}`
				};
				await notificationService.storeNotification(adminUserIds, notificationItem);

				console.log(
					`Scheduled email marketing #${newEmailMarketing.notification_code} successfully sent.`
				);
			});
		}

		res.status(200).json({
			status: "success",
			data: { newEmailMarketing }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateEmailMarketing = async (req: Request, res: Response) => {
	const {
		title,
		description,
		scheduled = null,
		selectedUserIds = [],
		removedUserIds = [],
		email_subject,
		params,
		templateId
	} = req.body;
	const { emailMarketingId } = req.params;

	try {
		if (!emailMarketingId) throw new ErrorObj.ClientError("Invalid notification marketing id!");

		const emailMarketingItem = await marketingService.getEmailMarketingDetail(emailMarketingId);

		// Check email template exist & it params
		const emailTemplate = await marketingService.getSingleEmailTemplate(templateId);

		// Remove full_name as required params since it is added automatically
		const templateParams = getEmailTemplateParams(emailTemplate.htmlContent).filter(
			param => param !== "full_name"
		);

		templateParams.push("email_subject"); // Add email subject as required param

		const emailParams = params;
		emailParams["email_subject"] = email_subject; // Add email_subject as params

		// Validate every params is provided
		if (!templateParams.every(param => Boolean(emailParams[param])))
			throw new ErrorObj.ClientError("Invalid params, make sure to provide all params.");

		let updatedEmailMarketingData: Partial<UpdateEmailMarketingData>;
		if (emailMarketingItem?.sent_at) {
			// Handle update for already sent notification marketing
			updatedEmailMarketingData = {
				title,
				description
			};
		} else {
			// Handle update for scheduled / expired notification marketing
			updatedEmailMarketingData = {
				title,
				description,
				scheduled,
				email_subject,
				template_id: templateId,
				params: emailParams
			};
		}

		// Update email marketing
		const updatedEmailMarketing = await marketingService.updateEmailMarketing(
			{
				updatedEmailMarketingData,
				emailMarketingId
			},
			selectedUserIds,
			removedUserIds
		);

		// Reschedule notification marketing if condition is fulfilled
		if (!updatedEmailMarketing?.sent_at && updatedEmailMarketing?.scheduled) {
			await marketingService.scheduleEmailMarketing(updatedEmailMarketing.id, {
				reschedule: true
			});
		}

		const updatedEmailMarketingDetail = await marketingService.getEmailMarketingDetail(
			emailMarketingId
		);

		res.status(200).json({
			status: "success",
			data: { updatedEmailMarketing: updatedEmailMarketingDetail }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const cancelEmailMarketing = async (req: Request, res: Response) => {
	const { emailMarketingId } = req.params;

	try {
		if (!emailMarketingId) throw new ErrorObj.ClientError("Invalid email marketing id!");

		// Get notif marketing item & check if exist
		const emailMarketingItem = await marketingService.getEmailMarketingDetail(emailMarketingId);

		if (emailMarketingItem?.sent_at)
			throw new ErrorObj.ClientError("Can't cancel already sent email marketing!");

		// Cancel notification marketing
		const updatedEmailMarketing = await marketingService.updateEmailMarketing({
			updatedEmailMarketingData: { canceled: true },
			emailMarketingId
		});

		res.status(200).json({
			status: "success",
			data: { canceledEmailMarketingId: updatedEmailMarketing.id }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
