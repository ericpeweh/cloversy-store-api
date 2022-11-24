// Config
import db from "../../../config/connectDB";

export const getAllCategories = async () => {
	let query = `SELECT id, name,
    (SELECT 
      COUNT(*) FROM product p 
      WHERE p.category_id = c.id
    ) AS product_amount 
    FROM category c
    ORDER BY product_amount DESC`;

	const categories = await db.query(query, []);

	return {
		categories
	};
};
