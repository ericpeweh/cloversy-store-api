// Config
import { QueryResult } from "pg";
import db from "../../../config/connectDB";

// Types
import { CartItem, CartItemDetails } from "../../interfaces";

export const getSessionCartItemsDetails = async (productIds: string[]) => {
	const uniqueProductIds = [...new Set(productIds)];

	const cartItemsQuery = `SELECT 
    p.product_id AS id, p.product_title AS title, p.product_status AS status, 
    p.product_description AS description, p.product_slug AS slug, p.*, 
    b.brand_name AS brand, 
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.product_id
    ),
    (SELECT array_agg("size" ORDER BY size ASC) AS sizes
      FROM product_size ps
      WHERE ps.product_id = p.product_id
    ),
    (SELECT array_agg("tag") AS tags
      FROM product_tag pt
      WHERE pt.product_id = p.product_id
    )
    FROM product p JOIN brand b
    ON p.brand_id = b.brand_id
    WHERE p.product_status = 'active'
    AND p.product_id = ANY ($1)
  `;

	const cartItemsResult = await db.query(cartItemsQuery, [uniqueProductIds]);
	return cartItemsResult;
};

export const getDBCartItemsDetails = async (userId: string) => {
	const cartItemsQuery = `SELECT 
    p.product_id as product_id, p.product_title AS title, 
    p.product_status AS status, 
    p.product_description AS description, p.product_slug AS slug, p.*, 
    b.brand_name AS brand, 
    c.cart_item_id AS id, c.quantity AS quantity, c.size AS size,
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.product_id
    ),
    (SELECT array_agg("size" ORDER BY size ASC) AS sizes
      FROM product_size ps
      WHERE ps.product_id = p.product_id
    ),
    (SELECT array_agg("tag") AS tags
      FROM product_tag pt
      WHERE pt.product_id = p.product_id
    )
    FROM cart c
    JOIN product p ON p.product_id = c.product_id
    JOIN brand b ON p.brand_id = b.brand_id
    WHERE c.user_id = $1
    AND p.product_status = 'active'
    ORDER BY c.cart_item_id DESC
  `;

	const cartItemsResult: QueryResult<CartItemDetails> = await db.query(cartItemsQuery, [userId]);
	return cartItemsResult;
};

export const checkCartItemExist = async (
	newCartItem: Omit<CartItem, "user_id">,
	userId: string
) => {
	const { product_id, size } = newCartItem;

	const cartItemQuery = `SELECT cart_item_id AS id FROM cart
    WHERE user_id = $1
    AND product_id = $2
    AND size = $3
  `;

	const cartItemResult = await db.query(cartItemQuery, [userId, product_id, size]);

	return cartItemResult.rowCount > 0;
};

export const checkCartItemExistById = async (cartItemId: string) => {
	const cartItemQuery = "SELECT cart_item_id FROM cart WHERE cart_item_id = $1";

	const cartItemResult = await db.query(cartItemQuery, [cartItemId]);

	return cartItemResult.rowCount > 0;
};

export const checkCartItemAuthorized = async (cartItemId: string, userId: string) => {
	const cartItemQuery = "SELECT cart_item_id FROM cart WHERE cart_item_id = $1 AND user_id = $2";

	const cartItemResult = await db.query(cartItemQuery, [cartItemId, userId]);

	return cartItemResult.rowCount > 0;
};

export const updateCartItemWithoutId = async (
	updatedCartItem: Omit<CartItem, "user_id">,
	userId: string
) => {
	const { product_id, size, quantity } = updatedCartItem;

	const cartItemQuery = `UPDATE cart
    SET quantity = quantity + $1 
    WHERE user_id = $2
    AND product_id = $3
    AND size = $4
    RETURNING *
  `;

	const cartItemResult = await db.query(cartItemQuery, [quantity, userId, product_id, size]);

	return cartItemResult;
};

export const updateCartItemById = async (cartItemId: string, quantity: number, userId: string) => {
	const cartItemQuery = `UPDATE cart
    SET quantity = $1
    WHERE cart_item_id = $2
    AND user_id = $3
  `;

	const cartItemResult = await db.query(cartItemQuery, [quantity, cartItemId, userId]);

	return cartItemResult;
};

export const addCartItemToDB = async (newCartItem: Omit<CartItem, "user_id">, userId: string) => {
	const { product_id, size, quantity } = newCartItem;

	const cartItemQuery = `INSERT INTO cart(
    user_id, product_id, size, quantity
  ) 
  VALUES ($1, $2, $3, $4) RETURNING *
  `;

	const cartItemResult = await db.query(cartItemQuery, [userId, product_id, size, quantity]);

	return cartItemResult;
};

export const addCartItemToDBIfNotExist = async (
	newCartItem: Omit<CartItem, "user_id">,
	userId: string
) => {
	const { product_id, size, quantity } = newCartItem;

	const cartItemQuery = `INSERT INTO cart(
      user_id, product_id, size, quantity
    ) 
    VALUES ($1, $2, $3, $4) 
    ON CONFLICT DO NOTHING
    RETURNING *
  `;

	const cartItemResult = await db.query(cartItemQuery, [userId, product_id, size, quantity]);

	return cartItemResult;
};

export const deleteCartItemById = async (cartItemId: string, userId: string) => {
	const cartItemQuery = `DELETE FROM cart
    WHERE cart_item_id = $1
    AND user_id = $2
  `;

	const cartItemResult = await db.query(cartItemQuery, [cartItemId, userId]);

	return cartItemResult;
};
