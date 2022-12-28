// Config
import db from "../../../config/connectDB";

// Utils
import { getLocalTime } from "../../utils";

export const subscribeToEmail = async (email: string) => {
	// Reset id sequence to current biggest id
	await db.query(
		`SELECT setval(pg_get_serial_sequence('email_subscription', 'id'), MAX(id)) FROM email_subscription`
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
