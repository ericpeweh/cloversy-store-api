// Config
import db from "../../config/connectDB";

// Types
import { CreateUserData } from "../interfaces";

export const getUserData = async (userEmail: string) => {
	const userQuery = "SELECT * FROM users WHERE email = $1";
	const userResult = await db.query(userQuery, [userEmail]);

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
