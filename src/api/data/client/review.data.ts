// Config
import db from "../../../config/connectDB";

// Types
import { ProductReviewItem, ReviewRequestItem } from "../../interfaces";
import { QueryResult } from "pg";

export const getProductReviews = async (productId: string) => {
	const reviewsQuery = `SELECT r.review_id AS id,
    ROUND(ROUND(r.rating, 2) / 2, 2) AS rating, r.review_description AS description, 
    r.created_at AS created_at, u.profile_picture AS profile_picture, u.full_name AS full_name
  FROM review r
  JOIN users u ON r.user_id = u.user_id
  WHERE r.product_id = $1
  AND r.review_status = 'active'`;

	const reviewsResult: QueryResult<ProductReviewItem> = await db.query(reviewsQuery, [productId]);

	return reviewsResult.rows;
};

export const createReviews = async (
	userId: string,
	transactionId: string,
	reviews: ReviewRequestItem[]
) => {
	const client = await db.pool.connect();

	const reviewsQuery = `INSERT INTO review
    (product_id, user_id, transaction_id, rating, review_description)
  VALUES ($1, $2, $3, $4, $5)`;

	try {
		await client.query("BEGIN");

		// Create review for each product
		for (const review of reviews) {
			await client.query(reviewsQuery, [
				review.product_id,
				userId,
				transactionId,
				review.rating,
				review.review
			]);
		}

		// Change transaction review status
		await client.query("UPDATE transactions SET is_reviewed = true WHERE id = $1", [transactionId]);

		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};
