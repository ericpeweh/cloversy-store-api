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
    u.profile_picture as profile_picture, u.full_name as full_name
  FROM review r
  JOIN users u ON r.user_id = u.id
  WHERE r.product_id = $1`;

	const reviewsResult: QueryResult<AdminProductReviewItem> = await db.query(reviewsQuery, [
		productId
	]);

	return reviewsResult.rows;
};
