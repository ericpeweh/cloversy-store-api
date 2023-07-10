// Config
import db from "../../../config/connectDB";

export const getAllCategories = async () => {
	const query = `SELECT category_id AS id, category_name AS name,
    (SELECT 
      COUNT(*) FROM product p 
      WHERE p.category_id = c.category_id
    ) AS product_amount 
    FROM category c
    ORDER BY product_amount DESC`;

	const categories = await db.query(query, []);

	return {
		categories
	};
};
