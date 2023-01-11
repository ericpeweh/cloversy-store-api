// Config
import db from "../../config/connectDB";

// Types
import { UpdateNotifMarketingDataArgs } from "../interfaces/notification.interface";

// Utils
import { generateUpdateQuery } from "../utils";

export const updateNotificationMarketing = async (
	updateNotifMarketingData: UpdateNotifMarketingDataArgs
) => {
	const { updatedNotifMarketingData, notifMarketingId } = updateNotifMarketingData;

	const { query: notificationQuery, params: notificationParams } = generateUpdateQuery(
		"notification_marketing",
		updatedNotifMarketingData,
		{ id: notifMarketingId }
	);

	await db.query(notificationQuery, notificationParams);
};

export const removeNotificationTokens = async (tokens: string[]) => {
	const notificationQuery = `DELETE FROM notification_subscription WHERE token = ANY ($1)`;

	await db.query(notificationQuery, [tokens]);
};

export const getSingleNotificationMarketing = async (notifMarketingId: number | string) => {
	const notificationQuery = `SELECT * FROM notification_subscription WHERE id = $1`;

	const notificationResult = await db.query(notificationQuery, [notifMarketingId]);

	return notificationResult.rows[0];
};

export const getUserNotificationTokens = async (userIds: string[] | number[]) => {
	const notificationQuery = `SELECT array_agg("token") 
    AS tokens
    FROM notification_subscription 
  WHERE user_id = ANY ($1)`;

	const notificationResult = await db.query(notificationQuery, [userIds]);

	return notificationResult.rows[0].tokens;
};

export const getAdminNotificationTokens = async () => {
	const notificationQuery = `SELECT array_agg("token")
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.id
  WHERE u.user_role = 'admin'`;

	const notificationResult = await db.query(notificationQuery, []);

	return notificationResult.rows[0].tokens;
};
