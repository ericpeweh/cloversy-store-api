// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";
import { CreateUserData, ProductLastSeen, User } from "../interfaces";

// Utils
import { generateUpdateQuery } from "../utils";

export const getAllCustomers = async (page: string, searchQuery: string, statusQuery: string) => {
	let paramsIndex = 1;
	const params = ["user"];
	const limit = 12;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT 
    u.user_id AS id, u.user_contact AS contact,
    u.user_status AS status, u.*
    FROM users u 
    WHERE user_role = $1`;
	let totalQuery = "SELECT COUNT(user_id) FROM users u WHERE user_role = $1";

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

	query += " ORDER BY user_id DESC";
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
	const userQuery = `SELECT 
    u.user_id AS id, u.user_contact AS contact,
    u.user_status AS status, u.* 
  FROM users u WHERE u.sub = $1`;
	const userResult = await db.query(userQuery, [userSub]);

	return userResult.rows[0];
};

export const getUserDataByEmail = async (userEmail: string) => {
	const userQuery = `SELECT 
    u.user_id AS id, u.user_contact AS contact,
    u.user_status AS status, u.* 
  FROM users u WHERE u.email = $1`;
	const userResult = await db.query(userQuery, [userEmail]);

	return userResult.rows[0];
};

export const getUserDataById = async (userId: string) => {
	const userQuery = `SELECT 
    u.user_id AS id, u.user_contact AS contact,
    u.user_status AS status, u.* 
  FROM users u WHERE user_id = $1`;
	const userResult = await db.query(userQuery, [userId]);

	const addressQuery = `SELECT 
    address_id AS id, address_contact AS contact, address.*
    FROM address 
    WHERE user_id = $1
  ORDER BY is_default DESC, address_id ASC`;
	const addressResult = await db.query(addressQuery, [userId]);

	const productSeenQuery = `SELECT 
    pls.*, pls.product_id AS id,
    p.product_title AS title,
    ROUND(p.price) AS price,
    p.product_slug AS slug,   
    (SELECT array_agg("url") AS images 
        FROM product_image pi 
        WHERE pi.product_id = p.product_id
    )
  FROM product_last_seen pls
  JOIN product p ON pls.product_id = p.product_id
  WHERE user_id = $1 AND p.product_status = 'active'
  ORDER BY seen_date DESC
  LIMIT 4`;

	const productSeenResult: QueryResult<ProductLastSeen> = await db.query(productSeenQuery, [
		userId
	]);

	const wishlistQuery = `SELECT 
    w.wishlist_id AS id, w.*, 
    p.product_title AS title,
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.product_id
    )
  FROM wishlist w 
  JOIN product p ON w.product_id = p.product_id
  WHERE user_id = $1
  ORDER BY w.created_at DESC`;
	const wishlistResult = await db.query(wishlistQuery, [userId]);

	const vouchersQuery = `SELECT 
    v.voucher_code AS code, v.voucher_title AS title,
    v.voucher_status AS status, v.* 
    FROM voucher_dist vd 
    JOIN voucher v
    ON vd.voucher_code = v.voucher_code
    WHERE vd.user_id = $1
  `;
	const vouchersResult = await db.query(vouchersQuery, [userId]);

	return { userResult, addressResult, productSeenResult, wishlistResult, vouchersResult };
};

export const createNewUser = async (userData: CreateUserData) => {
	const userQuery = `INSERT INTO users(
    full_name,
    email,
    profile_picture,
    sub
  ) VALUES ($1, $2, $3, $4) RETURNING *`;

	const userResult = await db.query(userQuery, userData);

	return userResult;
};

export const updateUser = async (updatedUserData: Partial<User>, userId: string) => {
	const { query, params } = generateUpdateQuery(
		"users",
		updatedUserData,
		{ user_id: userId },
		" RETURNING *"
	);

	const userResult = await db.query(query, params);

	return userResult.rows[0];
};

export const getAllAdminUserIds = async () => {
	const userQuery = `SELECT 
    array_agg("user_id") AS user_ids
  FROM users
  WHERE users.user_role = 'admin'`;

	const userResult: QueryResult<{ user_ids: number[] }> = await db.query(userQuery);

	return userResult.rows[0].user_ids;
};

export const getUserEmailAndNameByIds = async (userIds: string[] | number[]) => {
	const userQuery = `SELECT email, full_name
    FROM users
  WHERE user_id = ANY ($1) AND user_role = 'user'`;

	const userResult: QueryResult<{ email: string; full_name: string }> = await db.query(userQuery, [
		userIds
	]);

	return userResult.rows;
};

export const getCustomerCount = async () => {
	const userQuery = `SELECT COUNT(user_id) AS customer_count 
    FROM users
  WHERE user_role = 'user'`;

	const userResult = await db.query(userQuery);

	return userResult.rows[0].customer_count;
};
