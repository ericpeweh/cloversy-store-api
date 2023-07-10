// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";
import { PushSubscriptionItem, NotificationSubscription } from "../interfaces";

export const getPushSubscriptions = async (page: string, searchQuery: string) => {
	let paramsIndex = 1;
	const params = [];
	const limit = 12;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT DISTINCT ON (ns.user_id)
    ns.user_id AS id,
    ns.last_online AS last_online, 
    u.profile_picture AS profile_picture,
    u.full_name AS full_name,
    u.email AS email
  FROM notification_subscription ns
  JOIN users u ON ns.user_id = u.user_id
  `;
	let totalQuery = `SELECT COUNT(ns.id) 
    FROM notification_subscription ns
  JOIN users u ON ns.user_id = u.user_id`;

	// Filter for user only (no admin)
	query += " WHERE u.user_role = 'user'";
	totalQuery += " WHERE u.user_role = 'user'";

	if (searchQuery) {
		const searchPart = ` WHERE (u.email iLIKE $${paramsIndex} OR u.full_name iLIKE $${paramsIndex})`;
		query += searchPart;
		totalQuery += searchPart;

		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	query += " ORDER BY ns.user_id DESC";
	query += ` LIMIT ${limit} OFFSET ${offset}`;

	const subscriptions: QueryResult<PushSubscriptionItem> = await db.query(query, params);
	const totalResult = await db.query(totalQuery, params);
	const totalSubscriptions = totalResult.rows[0].count;

	return {
		subscriptions,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalSubscriptions),
		totalPages: Math.ceil(totalSubscriptions / limit)
	};
};

export const getNotifSubscriptionsByUserIds = async (userIds: string[] | number[]) => {
	const notificationQuery = `SELECT *
    FROM notification_subscription
  WHERE user_id = ANY ($1)`;

	const notificationResult: QueryResult<NotificationSubscription> = await db.query(
		notificationQuery,
		[userIds]
	);

	return notificationResult.rows;
};

export const getAllNotifSubscriptions = async () => {
	const notificationQuery = `SELECT * 
      FROM notification_subscription ns
    JOIN users u ON ns.user_id = u.user_id
    WHERE u.user_role = 'user'
    `;

	const notificationResult: QueryResult<NotificationSubscription> = await db.query(
		notificationQuery
	);

	return notificationResult.rows;
};

export const deleteExpiredTokens = async () => {
	const notificationQuery = `DELETE FROM notification_subscription
    WHERE last_online < NOW() - INTERVAL '60 days'
  RETURNING id`;

	const notificationResult = await db.query(notificationQuery);

	return notificationResult.rowCount;
};
