// Config
import db from "../../../config/connectDB";

export const getAllBrands = async () => {
	const query = `SELECT brand_id AS id, brand_name AS name,
    (SELECT 
      COUNT(*) FROM product p
      WHERE p.brand_id = b.brand_id
    ) AS product_amount  
    FROM brand b
    ORDER BY product_amount DESC`;

	const brandsResult = await db.query(query);

	return {
		brandsResult
	};
};
