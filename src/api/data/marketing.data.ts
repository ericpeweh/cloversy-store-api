// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";
import {
	CreateNotifMarketingData,
	SendNotificationResult,
	NotifMarketingItem,
	NotificationSubscription
} from "../interfaces";

// Utils
import { generateUniqueId } from "../utils";

export const createNotificationMarketing = async (
	newNotifMarketingData: CreateNotifMarketingData,
	notifSubscriptions: NotificationSubscription[],
	notificationResult: SendNotificationResult | undefined
) => {
	const client = await db.pool.connect();

	const {
		title,
		scheduled,
		description,
		message_title,
		message_body,
		image_url,
		action_link,
		action_title
	} = newNotifMarketingData;

	try {
		await client.query("BEGIN");

		// Create notification marketing record
		const notifMarketingQuery = `INSERT INTO notification_marketing (
      notification_code, title, sent, sent_at, scheduled, description,
      message_title, message_body, image_url, action_link, action_title,
      success_count, failure_count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *
`;

		const notifMarketingParams = [
			generateUniqueId(),
			title,
			notificationResult?.sendAt ? true : false,
			notificationResult?.sendAt,
			scheduled,
			description,
			message_title,
			message_body,
			image_url,
			action_link,
			action_title,
			notificationResult?.successCount,
			notificationResult?.failureCount
		];

		const notifMarketingResult: QueryResult<NotifMarketingItem> = await client.query(
			notifMarketingQuery,
			notifMarketingParams
		);

		// Create notification marketing target records
		if (notifSubscriptions.length > 0) {
			const notifMarketingTargetQuery = `INSERT INTO notification_marketing_target(
        notification_marketing_id,
        user_id,
        token
      ) VALUES ($1, $2, $3)`;

			notifSubscriptions.forEach(async sub => {
				await client.query(notifMarketingTargetQuery, [
					notifMarketingResult.rows[0].id,
					sub.user_id,
					sub.token
				]);
			});
		}

		await client.query("COMMIT");
		return notifMarketingResult.rows[0];
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};
