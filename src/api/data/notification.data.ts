// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";
import { NotificationItem, NotificationTypeFilter, NotifMarketingItem } from "../interfaces";
import { ErrorObj } from "../utils";

export const getAllNotifications = async (
	typeFilter: NotificationTypeFilter,
	page: string,
	itemsLimit: string,
	userId: string
) => {
	let paramsIndex = 1;
	const params = [userId];
	const limit = itemsLimit ? +itemsLimit : 12;
	const offset = parseInt(page) * limit - limit;

	let notificationQuery = `SELECT 
    n.notification_id AS id, n.notification_title AS title, n.notification_description AS description, 
    n.notification_category_id AS category_id, n.*, nc.notification_category_name AS category_name, nr.is_read AS is_read
  FROM notification n
  JOIN notification_category nc ON nc.notification_category_id = n.notification_category_id
  LEFT JOIN notification_read nr ON nr.notification_id = n.notification_id
  WHERE nr.user_id = $1
  `;

	let totalQuery = `SELECT COUNT(n.notification_id) as count, 
  (
    SELECT COUNT(n.notification_id) AS not_read
    FROM notification n
    LEFT JOIN notification_read nr ON nr.notification_id = n.notification_id
    WHERE nr.user_id = $1 AND nr.is_read = FALSE
  )
  FROM notification n
  JOIN notification_category nc ON nc.notification_category_id = n.notification_category_id
  LEFT JOIN notification_read nr ON nr.notification_id = n.notification_id
  WHERE nr.user_id = $1
  `;

	if (typeFilter) {
		const filterPart = ` AND nc.notification_category_name = $${paramsIndex + 1}`;
		notificationQuery += filterPart;
		totalQuery += filterPart;

		params.push(typeFilter);
		paramsIndex += 1;
	}

	notificationQuery += " ORDER BY n.created_at DESC";

	if (page) {
		notificationQuery += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const totalResult = await db.query(totalQuery, params);
	const totalNotifications = totalResult.rows[0].count;
	const notRead = totalResult.rows[0].not_read;
	const notifications = (await db.query(notificationQuery, params)).rows;

	return {
		notifications,
		notRead,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalNotifications),
		totalPages: Math.ceil(totalNotifications / limit)
	};
};

export const removeNotificationTokens = async (tokens: string[]) => {
	const notificationQuery = "DELETE FROM notification_subscription WHERE token = ANY ($1)";

	await db.query(notificationQuery, [tokens]);
};

export const getSingleNotificationMarketing = async (notifMarketingId: number | string) => {
	const notificationQuery = `SELECT nm.notification_marketing_id AS id, nm.* 
      FROM notification_marketing nm 
      WHERE nm.notification_marketing_id = $1`;

	const notificationResult: QueryResult<NotifMarketingItem> = await db.query(notificationQuery, [
		notifMarketingId
	]);

	return notificationResult.rows[0];
};

export const getNotificationTokens = async (userIds: string[] | number[]) => {
	const notificationQuery = `SELECT 
    COALESCE(array_agg("token"), '{}') 
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.user_id
  WHERE ns.user_id = ANY ($1)`;

	const notificationResult: QueryResult<{ tokens: string[] }> = await db.query(notificationQuery, [
		userIds
	]);

	return notificationResult.rows[0].tokens;
};

export const getUserNotificationTokens = async (userIds: string[] | number[]) => {
	const notificationQuery = `SELECT 
    COALESCE(array_agg("token"), '{}') 
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.user_id
  WHERE ns.user_id = ANY ($1) AND u.user_role = 'user'`;

	const notificationResult: QueryResult<{ tokens: string[] }> = await db.query(notificationQuery, [
		userIds
	]);

	return notificationResult.rows[0].tokens;
};

export const getAdminNotificationTokens = async () => {
	const notificationQuery = `SELECT 
    COALESCE(array_agg("token"), '{}')
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.user_id
  WHERE u.user_role = 'admin'`;

	const notificationResult: QueryResult<{ tokens: string[] }> = await db.query(notificationQuery);

	return notificationResult.rows[0].tokens;
};

export const getAllUserNotificationTokens = async () => {
	const notificationQuery = `SELECT 
    COALESCE(array_agg("token"), '{}')
    AS tokens
    FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.user_id
  WHERE u.user_role = 'user'`;

	const notificationResult: QueryResult<{ tokens: string[] }> = await db.query(notificationQuery);

	return notificationResult.rows[0].tokens;
};

export const storeNotification = async (
	userIds: number[],
	notificationData: Omit<NotificationItem, "id" | "created_at" | "user_id">
) => {
	if (userIds.length > 0) {
		const { title, description, category_id, action_link } = notificationData;
		const notificationQuery = `INSERT INTO notification(
      notification_title, notification_description, user_id, notification_category_id, action_link
    ) VALUES ($1, $2, $3, $4, $5) RETURNING *`;

		const newNotifications: NotificationItem[] = [];
		for (const userId of userIds) {
			const result: QueryResult<NotificationItem> = await db.query(notificationQuery, [
				title,
				description,
				userId,
				category_id,
				action_link
			]);

			newNotifications.push(result.rows[0]);
		}

		const notificationReadQuery = `INSERT INTO notification_read(
      user_id, notification_id
    ) VALUES ($1, $2)`;

		for (const { user_id, notification_id } of newNotifications) {
			await db.query(notificationReadQuery, [user_id, notification_id]);
		}
	}
};

export const getNotificationItem = async (notificationId: string) => {
	const notificationQuery = `SELECT 
    n.notification_id AS id, n.notification_title AS title, 
    n.notification_description AS description, n.notification_category_id AS category_id, n.* 
    FROM notification n WHERE n.notification_id = $1`;

	const notificationResult: QueryResult<NotificationItem> = await db.query(notificationQuery, [
		notificationId
	]);

	if (notificationResult.rowCount === 0)
		throw new ErrorObj.ClientError(`Notification with id ${notificationId} not found`, 404);

	return notificationResult.rows[0];
};

export const readNotification = async (notificationId: string, userId: string) => {
	const notificationQuery = `UPDATE notification_read nr
    SET is_read = TRUE
    WHERE notification_id = $1
    AND user_id = $2
    RETURNING notification_id
  `;

	const notificationResult = await db.query(notificationQuery, [notificationId, userId]);

	const notReadQuery = `SELECT COUNT(n.notification_id) AS not_read
  FROM notification n
  LEFT JOIN notification_read nr ON nr.notification_id = n.notification_id
  WHERE nr.user_id = $1 AND nr.is_read = FALSE`;

	const notReadResult = await db.query(notReadQuery, [userId]);

	return {
		readNotificationId: notificationResult.rows[0].notification_id,
		notRead: notReadResult.rows[0].not_read
	};
};
