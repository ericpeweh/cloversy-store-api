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

	let query = `SELECT DISTINCT ON (id)
    ns.user_id as id,
    ns.last_online as last_online, 
    u.profile_picture as profile_picture,
    u.full_name as full_name,
    u.email as email
  FROM notification_subscription ns
  JOIN users u ON ns.user_id = u.id
  `;
	let totalQuery = "SELECT COUNT(id) FROM notification_subscription";

	if (searchQuery) {
		const searchPart = ` WHERE (u.email iLIKE $${paramsIndex} OR u.full_name iLIKE $${paramsIndex})`;
		query += searchPart;
		totalQuery += searchPart;

		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	// INI buat rest api
	query += " ORDER BY id DESC";
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
