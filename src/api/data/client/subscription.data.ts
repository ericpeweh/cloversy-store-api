// Config
import db from "../../../config/connectDB";

// Types
import { QueryResult } from "pg";
import { NotificationSubscription } from "../../interfaces";

// Utils
import { getLocalTime } from "../../utils";

export const subscribeToEmail = async (email: string) => {
	// Reset id sequence to current biggest id
	await db.query(
		"SELECT setval(pg_get_serial_sequence('email_subscription', 'email_subscription_id'), MAX(email_subscription_id)) FROM email_subscription"
	);

	const emailQuery = `INSERT INTO email_subscription 
    (email) VALUES ($1) 
  ON CONFLICT (email)
  DO UPDATE SET subscription_date = $2`;

	await db.query(emailQuery, [email, getLocalTime()]);

	return email;
};

export const unsubscribeFromEmail = async (email: string) => {
	const emailQuery = `DELETE FROM email_subscription 
    WHERE email = $1`;

	await db.query(emailQuery, [email]);

	return email;
};

export const subscribeToPush = async (token: string, userId: string) => {
	// Reset id sequence to current biggest id
	await db.query(
		"SELECT setval(pg_get_serial_sequence('notification_subscription', 'id'), MAX(id)) FROM notification_subscription"
	);

	const pushQuery = `INSERT INTO notification_subscription 
    (token, user_id) VALUES ($1, $2) 
  ON CONFLICT (token)
  DO UPDATE SET last_online = $3, user_id = $2 RETURNING id`;

	const pushResult: QueryResult<{ id: number }> = await db.query(pushQuery, [
		token,
		userId,
		getLocalTime()
	]);

	// Return subscription record id
	return pushResult.rows[0].id;
};

export const unsubscribeFromPush = async (subscriptionId: number) => {
	const pushQuery = `DELETE FROM notification_subscription
    WHERE id = $1
  `;

	await db.query(pushQuery, [subscriptionId]);
};

export const getSingleUserSubscription = async (subscriptionId: number) => {
	const pushQuery = `SELECT * FROM notification_subscription
    WHERE id = $1`;

	const pushResult: QueryResult<NotificationSubscription> = await db.query(pushQuery, [
		subscriptionId
	]);

	return pushResult.rows[0];
};
