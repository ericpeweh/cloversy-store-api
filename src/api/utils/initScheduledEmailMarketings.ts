// Utils
import scheduler from "./scheduler";

// Services
import { marketingService, notificationService, userService } from "../services";

// Types
import { EmailObject } from "../interfaces";

const initScheduledEmailMarketings = async () => {
	// Get scheduled notif marketings
	const { emailMarketings } = await marketingService.getEmailMarketings("", "", "true");

	let initialiedJobsCount = 0;
	for (const emailMarketing of emailMarketings) {
		const { scheduled, notification_code, email_subject, params, template_id } = emailMarketing;
		const triggerAt = new Date(scheduled);

		// Get notification targets
		const selectedUserIds = await marketingService.getNotifMarketingTargetUserIds(
			emailMarketing.id.toString()
		);

		const targets = await userService.getUserEmailAndNameByIds(selectedUserIds);

		// Build email
		const emailParams = params;
		emailParams["email_subject"] = email_subject; // Add email_subject as params

		const emailObject: EmailObject = {
			to: targets.map(({ full_name, email }) => ({
				email,
				name: full_name
			})),
			templateId: +template_id,
			params: emailParams
		};

		// Schedule job
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
				emailMarketingId: emailMarketing.id
			});

			// Store notification to admins
			const adminUserIds = await userService.getAllAdminUserIds();
			const notificationItem = {
				title: "Marketing email terjadwal telah dikirim",
				description: `Marketing email #${notification_code} berhasil dikirim.`,
				category_id: 2, // = marketing category
				action_link: `https://admin.cloversy.id/marketing/email/${emailMarketing.id}`
			};
			await notificationService.storeNotification(adminUserIds, notificationItem);

			console.log(
				`Scheduled email marketing #${emailMarketing.notification_code} successfully sent.`
			);
		});

		initialiedJobsCount += 1;
	}

	console.log(
		`Scheduled ${initialiedJobsCount} email marketing ${initialiedJobsCount > 1 ? "jobs" : "job"}`
	);
};

export default initScheduledEmailMarketings;
