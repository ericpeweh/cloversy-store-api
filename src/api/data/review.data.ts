// Config
import db from "../../config/connectDB";

// Types
import { AdminProductReviewItem } from "../interfaces";
import { QueryResult } from "pg";

export const getProductReviews = async (productId: string) => {
	const reviewsQuery = `SELECT r.id as id,
    ROUND(ROUND(r.rating, 2) / 2, 2) AS rating, 
    r.description as description, r.created_at as created_at, 
    r.status as status, r.transaction_id as transaction_id,
    r.product_id as product_id,
    u.profile_picture as profile_picture, u.full_name as full_name,
    p.title as product_title
  FROM review r
  JOIN users u ON r.user_id = u.id
  JOIN product p ON r.product_id = p.id
  WHERE r.product_id = $1`;

	const reviewsResult: QueryResult<AdminProductReviewItem> = await db.query(reviewsQuery, [
		productId
	]);

	return reviewsResult.rows;
};

export const getTransactionReviews = async (transactionId: string) => {
	const reviewsQuery = `SELECT r.id as id,
    ROUND(ROUND(r.rating, 2) / 2, 2) AS rating, 
    r.description as description, r.created_at as created_at, 
    r.status as status, r.transaction_id as transaction_id,
    r.product_id as product_id,
    u.profile_picture as profile_picture, u.full_name as full_name,
    p.title as product_title
  FROM review r
  JOIN users u ON r.user_id = u.id
  JOIN product p ON r.product_id = p.id
  WHERE r.transaction_id = $1
  `;

	const reviewsResult: QueryResult<AdminProductReviewItem> = await db.query(reviewsQuery, [
		transactionId
	]);

	return reviewsResult.rows;
};

export const getAllReviews = async (
	searchQuery: string,
	reviewStatus: string,
	sortBy: string,
	page: string,
	itemsLimit: string,
	transactionId: string
) => {
	let paramsIndex = 0;
	const params = [];
	const limit = itemsLimit ? +itemsLimit : 12;
	const offset = parseInt(page) * limit - limit;

	let reviewsQuery = `SELECT r.id as id,
    ROUND(ROUND(r.rating, 2) / 2, 2) AS rating, 
    r.description as description, r.created_at as created_at, 
    r.status as status, r.transaction_id as transaction_id,
    r.product_id as product_id,
    u.profile_picture as profile_picture, u.full_name as full_name,
    p.title as product_title
  FROM review r
  JOIN users u ON r.user_id = u.id
  JOIN product p ON r.product_id = p.id`;

	let totalQuery = `SELECT COUNT(r.id) FROM review r
    JOIN users u ON r.user_id = u.id
    JOIN product p ON r.product_id = p.id
  `;

	if (reviewStatus) {
		reviewsQuery += ` WHERE r.status = $${paramsIndex + 1}`;
		totalQuery += ` WHERE r.status = $${paramsIndex + 1}`;
		params.push(reviewStatus);
		paramsIndex += 1;
	}

	if (transactionId) {
		const transactionFilter = ` ${paramsIndex === 0 ? "WHERE" : "AND"} r.transaction_id = $${
			paramsIndex + 1
		}
    `;
		reviewsQuery += transactionFilter;
		totalQuery += transactionFilter;
		params.push(transactionId.toUpperCase());
		paramsIndex += 1;
	}

	if (searchQuery) {
		const searchPart = ` ${paramsIndex === 0 ? "WHERE" : "AND"} 
    (
      r.transaction_id iLIKE $${paramsIndex + 1} 
      OR r.description iLIKE $${paramsIndex + 1}
      OR u.full_name iLIKE $${paramsIndex + 1} 
      OR u.email iLIKE $${paramsIndex + 1}
      OR p.title iLIKE $${paramsIndex + 1}
    )`;
		reviewsQuery += searchPart;
		totalQuery += searchPart;
		params.push(`%${searchQuery}%`);
		paramsIndex += 1;
	}

	if (sortBy === "status") {
		reviewsQuery += ` ORDER BY r.status ASC`;
	}

	if (["id", "rating", "created_at"].includes(sortBy)) {
		reviewsQuery += ` ORDER BY r.${sortBy} DESC`;
	}

	if (page) {
		reviewsQuery += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const totalReviews = (await db.query(totalQuery, params)).rows[0].count;
	const reviews = (await db.query(reviewsQuery, params)).rows;

	return {
		reviews,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalReviews),
		totalPages: Math.ceil(totalReviews / limit)
	};
};

export const getSingleReview = async (reviewId: string) => {
	const reviewQuery = `SELECT r.id as id,
    ROUND(ROUND(r.rating, 2) / 2, 2) AS rating, 
    r.description as description, r.created_at as created_at, 
    r.status as status, r.transaction_id as transaction_id,
    r.product_id as product_id,
    u.profile_picture as profile_picture, u.full_name as full_name,
    p.title as product_title
  FROM review r
  JOIN users u ON r.user_id = u.id
  JOIN product p ON r.product_id = p.id
  WHERE r.id = $1`;

	const reviewResult: QueryResult<AdminProductReviewItem> = await db.query(reviewQuery, [reviewId]);

	return reviewResult;
};

export const updateReview = async (
	reviewId: string,
	rating: string,
	review: string,
	created_at: string,
	status: "active" | "disabled"
) => {
	const reviewQuery = `UPDATE review
    SET rating = $1, description = $2, created_at = $3, status = $4
    WHERE id = $5
  `;

	await db.query(reviewQuery, [rating, review, created_at, status, reviewId]);

	return reviewId;
};
