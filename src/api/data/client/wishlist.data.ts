// Config
import db from "../../../config/connectDB";

export const getWishlistProducts = async (userId: string) => {
	const wishlistQuery = `SELECT p.*, b.name AS brand, 
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.id
    ),
    (SELECT array_agg("size" ORDER BY size ASC) AS sizes
      FROM product_size ps
      WHERE ps.product_id = p.id
    ),
    (SELECT array_agg("tag") AS tags
      FROM product_tag pt
      WHERE pt.product_id = p.id
    )
    FROM wishlist w 
    JOIN product p
      ON w.product_id = p.id
    JOIN brand b
      ON p.brand_id = b.id
    WHERE w.user_id = $1
    ORDER BY w.id DESC
  `;

	const wishlistResult = await db.query(wishlistQuery, [userId]);
	return wishlistResult;
};

export const getWishlistData = async (userId: string) => {
	const query = "SELECT * FROM wishlist WHERE user_id = $1 ORDER BY id DESC";
	const result = await db.query(query, [userId]);

	return result;
};

export const checkProductIsWishlisted = async (productId: string, userId: string) => {
	const query = "SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2";
	const result = await db.query(query, [userId, productId]);

	return result.rows.length !== 0;
};

export const addProductToWishlist = async (productId: string, userId: string) => {
	const query = `INSERT INTO wishlist(
    user_id,
    product_id
  ) VALUES ($1, $2)`;
	const result = await db.query(query, [userId, productId]);

	return result;
};

export const deleteProductFromWishlist = async (productId: string, userId: string) => {
	const query = "DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2";
	const result = await db.query(query, [userId, productId]);

	return result;
};
export const emptyWishlist = async (userId: string) => {
	const query = "DELETE FROM wishlist WHERE user_id = $1";
	const result = await db.query(query, [userId]);

	return result;
};
