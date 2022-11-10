// Config
import db from "../../config/connectDB";

// Types
import { CreateUserData } from "../interfaces";

export const getUserDataByEmail = async (userEmail: string) => {
	const userQuery = "SELECT * FROM users WHERE email = $1";
	const userResult = await db.query(userQuery, [userEmail]);

	return userResult;
};

export const getUserDataById = async (userId: string) => {
	const userQuery = "SELECT * FROM users WHERE id = $1";
	const userResult = await db.query(userQuery, [userId]);

	return userResult;
};

export const createNewUser = async (userData: CreateUserData) => {
	const userQuery = `INSERT INTO users(
    full_name,
    email,
    profile_image
  ) VALUES ($1, $2, $3) RETURNING *`;

	const userResult = await db.query(userQuery, userData);

	return userResult;
};

export const getAllCustomers = async (searchQuery: string, statusQuery: string) => {
	let paramsIndex = 1;
	const params = ["user"];
	let query = "SELECT * FROM users WHERE user_role = $1";

	if (searchQuery) {
		query += ` AND (email LIKE $${paramsIndex + 1} OR full_name LIKE $${paramsIndex + 2})`;
		paramsIndex += 2;
		params.push(`%${searchQuery}%`, `%${searchQuery}%`);
	}

	if (statusQuery) {
		query += ` AND user_status = $${paramsIndex + 1}`;
		params.push(statusQuery);
	}

	const customers = await db.query(query, params);

	return customers;
};
