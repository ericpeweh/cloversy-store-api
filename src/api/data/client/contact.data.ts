// Config
import db from "../../../config/connectDB";

// Types
import { CreateContactUsItem } from "../../interfaces";

export const createMessageWebForm = async (newMessage: CreateContactUsItem) => {
	const { senderName, email, objective, title, message } = newMessage;

	const contactUsQuery = `INSERT INTO contact_us
    (sender_name, email, objective, title, message)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;

	const contactUsResult = await db.query(contactUsQuery, [
		senderName,
		email,
		objective,
		title,
		message
	]);

	return contactUsResult.rows[0].id;
};
