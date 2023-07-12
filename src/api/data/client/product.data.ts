// Config
import { QueryResult } from "pg";
import db from "../../../config/connectDB";

// Types
import { ProductLastSeen } from "../../interfaces";

// Utils
import { ErrorObj, getLocalTime } from "../../utils";

export const getAllProducts = async (
	page: string,
	searchQuery: string,
	sortBy: string,
	brandFilter: string,
	count: string,
	priceFilter: string
) => {
	let paramsIndex = 0;
	const params = [];
	const limit = parseInt(count) || 12;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT 
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
    ),
		(SELECT ROUND(AVG(rating) / 2, 2) AS rating
			FROM review r
			WHERE r.product_id = p.product_id AND r.review_status = 'active'
		),
		(SELECT COUNT(r.review_id) AS review_count
			FROM review r
			WHERE r.product_id = p.product_id AND r.review_status = 'active'
		),
    (SELECT COALESCE(SUM(ti.quantity), 0) AS popularity
      FROM transactions_item ti
      WHERE ti.product_id = p.product_id
    )
    FROM product p JOIN brand b
    ON p.brand_id = b.brand_id
    WHERE p.product_status = 'active'`;

	let totalQuery = "SELECT COUNT(product_id) FROM product WHERE product_status = 'active'";

	if (brandFilter) {
		const filter = ` AND brand_id = $${paramsIndex + 1}`;
		query += filter;
		totalQuery += filter;
		params.push(brandFilter);
		paramsIndex += 1;
	}

	if (searchQuery) {
		const search = ` AND product_title iLIKE $${paramsIndex + 1}`;
		query += search;
		totalQuery += search;
		params.push(`%${searchQuery}%`);
		paramsIndex += 1;
	}

	if (priceFilter) {
		const filter = priceFilter.split(",");
		const price = ` AND price BETWEEN $${paramsIndex + 1} AND $${paramsIndex + 2}`;
		query += price;
		totalQuery += price;
		params.push(filter[0], filter[1]);
		paramsIndex += 2;
	}

	if (sortBy) {
		const sorter =
			sortBy === "low-to-high" || sortBy === "high-to-low"
				? "price"
				: sortBy === "id"
				? "product_id"
				: sortBy;
		const sortType = sortBy === "low-to-high" ? "ASC" : "DESC";

		query += ` ORDER BY ${sorter} ${sortType} NULLS LAST`;

		if (sortBy === "popularity" || sortBy === "rating") {
			// Double sort (sort by 'popularity' | 'rating' then 'product_id')
			// To prevent double product occurence with pagination
			query += " ,product_id";
		}
	}

	if (page) {
		query += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const totalResult = await db.query(totalQuery, params);
	const totalCustomers = totalResult.rows[0].count;

	const products = await db.query(query, params);

	return {
		products,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalCustomers),
		totalPages: Math.ceil(totalCustomers / limit)
	};
};

export const getSingleProductBySlug = async (productSlug: string) => {
	const productQuery = `SELECT 
    p.product_id AS id, p.product_title AS title, p.product_status AS status, 
    p.product_description AS description, p.product_slug AS slug, p.*, ROUND(p.price) AS price,
    b.brand_name AS brand, c.category_name AS category,
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
    ),
    (SELECT ROUND(AVG(rating) / 2, 2) AS rating
			FROM review r
			WHERE r.product_id = p.product_id AND r.review_status = 'active'
		),
		(SELECT COUNT(r.review_id) AS review_count
			FROM review r
			WHERE r.product_id = p.product_id AND r.review_status = 'active'
		)
    FROM product p
    JOIN brand b ON p.brand_id = b.brand_id 
    JOIN category c ON p.category_id = c.category_id 
    WHERE p.product_slug = $1 
  `;
	const productResult = await db.query(productQuery, [productSlug]);

	if (productResult.rows.length === 0) {
		throw new ErrorObj.ClientError("Product not found!", 404);
	}

	return productResult;
};

export const getProductRecommendations = async (productTags: string[], productId: number) => {
	const recommendationsQuery = `
  SELECT * FROM (
      SELECT p.product_id AS id, p.product_title AS title, p.product_status AS status, 
      p.product_description AS description, p.product_slug AS slug, p.*, 
      ROUND(p.price) AS price , b.brand_name AS brand, c.category_name AS category,
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
      ),
      (SELECT ROUND(AVG(rating) / 2, 2) AS rating
        FROM review r
        WHERE r.product_id = p.product_id AND r.review_status = 'active'
		  ),
      (SELECT COALESCE(SUM(ti.quantity), 0) AS popularity
        FROM transactions_item ti
        WHERE ti.product_id = p.product_id
      )
      FROM product p
      JOIN brand b ON p.brand_id = b.brand_id 
      JOIN category c ON p.category_id = c.category_id 
    ) AS filtered
  WHERE filtered.tags && ($1) AND filtered.id != $2
  ORDER BY popularity DESC, rating DESC NULLS LAST
  LIMIT 4
  `;
	const recommendationsResult = await db.query(recommendationsQuery, [productTags, productId]);

	return recommendationsResult;
};

export const getProductImages = async (productId: string) => {
	const imageQuery = "SELECT url FROM product_image WHERE product_id = $1";

	const imagesResult = await db.query(imageQuery, [productId]);

	return imagesResult;
};

export const getProductsPriceRange = async () => {
	const priceRangeQuery = `SELECT 
    ROUND(max(price)) as max_price,
    ROUND(min(price)) as min_price 
  FROM product WHERE product_status = 'active'`;

	const priceRangeResult = await db.query(priceRangeQuery);

	return priceRangeResult;
};

export const checkProductExistById = async (productId: string) => {
	const productQuery = "SELECT product_id FROM product WHERE product_id = $1";

	const productResult = await db.query(productQuery, [productId]);

	return productResult.rows.length !== 0;
};

export const getUserLastSeenProducts = async (userId: string) => {
	const productSeenQuery = `SELECT pls.*,
    p.product_title as title,
    ROUND(p.price) as price,
    p.product_slug as slug,
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

	return productSeenResult.rows;
};

export const trackUserLastSeenProduct = async (productId: string, userId: string) => {
	// Reset id sequence to current biggest id
	await db.query(
		"SELECT setval(pg_get_serial_sequence('product_last_seen', 'id'), MAX(id)) FROM product_last_seen;"
	);

	const productSeenQuery = `INSERT INTO product_last_seen 
    (product_id, user_id) VALUES($1, $2)
  ON CONFLICT (product_id, user_id)
  DO UPDATE SET seen_date = $3`;

	await db.query(productSeenQuery, [productId, userId, getLocalTime()]);

	return productId;
};
