// Config
import db from "../../config/connectDB";

// Types
import { CreateUserData, User } from "../interfaces";

// Utils
import generateUpdateQuery from "../utils/generateUpdateQuery";

export const getAllCustomers = async (page: string, searchQuery: string, statusQuery: string) => {
	let paramsIndex = 1;
	const params = ["user"];
	const limit = 12;
	const offset = parseInt(page) * limit - limit;

	let query = "SELECT * FROM users WHERE user_role = $1";
	let totalQuery = "SELECT COUNT(id) FROM users WHERE user_role = $1";

	if (searchQuery) {
		const searchPart = ` AND (email iLIKE $${paramsIndex + 1} OR full_name iLIKE $${
			paramsIndex + 2
		})`;
		query += searchPart;
		totalQuery += searchPart;

		paramsIndex += 2;
		params.push(`%${searchQuery}%`, `%${searchQuery}%`);
	}

	if (statusQuery) {
		const statusPart = ` AND user_status = $${paramsIndex + 1}`;
		query += statusPart;
		totalQuery += statusPart;

		params.push(statusQuery);
	}
	// INI buat rest api
	query += " ORDER BY id DESC";
	query += ` LIMIT ${limit} OFFSET ${offset}`;

	const customers = await db.query(query, params);
	const totalResult = await db.query(totalQuery, params);
	const totalCustomers = totalResult.rows[0].count;

	return {
		customers,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalCustomers),
		totalPages: Math.ceil(totalCustomers / limit)
	};
};

export const getUserDataBySub = async (userSub: string) => {
	const userQuery = "SELECT * FROM users WHERE sub = $1";
	const userResult = await db.query(userQuery, [userSub]);

	return userResult;
};

export const getUserDataByEmail = async (userEmail: string) => {
	const userQuery = "SELECT * FROM users WHERE email = $1";
	const userResult = await db.query(userQuery, [userEmail]);

	return userResult;
};

export const getUserDataById = async (userId: string) => {
	const userQuery = "SELECT * FROM users WHERE id = $1";
	const userResult = await db.query(userQuery, [userId]);

	const addressQuery = "SELECT * FROM address WHERE user_id = $1";
	const addressResult = await db.query(addressQuery, [userId]);

	const lastSeenQuery = `SELECT p.id, p.title 
    FROM user_last_seen uls
    JOIN product p
      ON uls.product_id = p.id
    WHERE uls.user_id = $1
  `;
	const lastSeenResult = await db.query(lastSeenQuery, [userId]);

	const wishlistQuery = "SELECT * FROM wishlist WHERE user_id = $1";
	const wishlistResult = await db.query(wishlistQuery, [userId]);

	const vouchersQuery = `SELECT v.* FROM voucher_dist vd 
    JOIN voucher v
    ON vd.voucher_code = v.code
    WHERE vd.user_id = $1
  `;
	const vouchersResult = await db.query(vouchersQuery, [userId]);

	return { userResult, addressResult, lastSeenResult, wishlistResult, vouchersResult };
};

export const createNewUser = async (userData: CreateUserData) => {
	const userQuery = `INSERT INTO users(
    full_name,
    email,
    profile_image,
    sub
  ) VALUES ($1, $2, $3, $4) RETURNING *`;

	const userResult = await db.query(userQuery, userData);

	return userResult;
};

export const updateUser = async (updatedUserData: Partial<User>, userId: string) => {
	const { query, params } = generateUpdateQuery(
		"users",
		updatedUserData,
		{ id: userId },
		" RETURNING *"
	);

	const userResult = await db.query(query, params);

	return userResult;
};
