// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";

export const removeNotificationTokens = async (tokens: string[]) => {
	const notificationQuery = `DELETE FROM notification_subscription WHERE token = ANY ($1)`;

	await db.query(notificationQuery, [tokens]);
};

export const getSingleNotificationMarketing = async (notifMarketingId: number | string) => {
	const notificationQuery = `SELECT * FROM notification_marketing WHERE id = $1`;

	const notificationResult = await db.query(notificationQuery, [notifMarketingId]);

	return notificationResult.rows[0];
};

export const getUserNotificationTokens = async (userIds: string[] | number[]) => {
	const notificationQuery = `SELECT array_agg("token") 
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.id
  WHERE user_id = ANY ($1) AND u.user_role = 'user'`;

	const notificationResult: QueryResult<{ tokens: string[] }> = await db.query(notificationQuery, [
		userIds
	]);

	return notificationResult.rows[0].tokens;
};

export const getAdminNotificationTokens = async () => {
	const notificationQuery = `SELECT array_agg("token")
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.id
  WHERE u.user_role = 'admin'`;

	const notificationResult: QueryResult<{ tokens: string[] }> = await db.query(notificationQuery);

	return notificationResult.rows[0].tokens;
};

export const getAllUserNotificationTokens = async () => {
	const notificationQuery = `SELECT array_agg("token")
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.id
  WHERE u.user_role = 'user'`;

	const notificationResult: QueryResult<{ tokens: string[] }> = await db.query(notificationQuery);

	return notificationResult.rows[0].tokens;
};
