// Config
import db from "../../../config/connectDB";

// Utils
import { ErrorObj } from "../../utils";

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

	let query = `SELECT p.*, b.name AS brand, 
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
    FROM product p JOIN brand b
    ON p.brand_id = b.id
    WHERE p.status = 'active'`;

	let totalQuery = "SELECT COUNT(id) FROM product WHERE status = 'active'";

	if (brandFilter) {
		const filter = ` AND brand_id = $${paramsIndex + 1}`;
		query += filter;
		totalQuery += filter;
		params.push(brandFilter);
		paramsIndex += 1;
	}

	if (searchQuery) {
		const search = ` AND title iLIKE $${paramsIndex + 1}`;
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
		const sorter = sortBy === "low-to-high" || sortBy === "high-to-low" ? "price" : sortBy;
		const sortType = sortBy === "low-to-high" ? "ASC" : "DESC";

		query += ` ORDER BY ${sorter} ${sortType}`;
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
	const productQuery = `SELECT p.*, ROUND(p.price) AS price , b.name AS brand, c.name AS category,
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
    FROM product p
    JOIN brand b ON p.brand_id = b.id 
    JOIN category c ON p.category_id = c.id 
    WHERE p.slug = $1 
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
      SELECT p.*, ROUND(p.price) AS price , b.name AS brand, c.name AS category,
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
      FROM product p
      JOIN brand b ON p.brand_id = b.id 
      JOIN category c ON p.category_id = c.id 
    ) AS filtered
  WHERE filtered.tags && ($1) AND filtered.id != $2
  LIMIT 4
  `;
	const recommendationsResult = await db.query(recommendationsQuery, [productTags, productId]);

	return recommendationsResult;
};

export const getProductImages = async (productId: string) => {
	const imageQuery = `SELECT url FROM product_image WHERE product_id = $1`;

	const imagesResult = await db.query(imageQuery, [productId]);

	return imagesResult;
};

export const getProductsPriceRange = async () => {
	const priceRangeQuery = `SELECT 
    ROUND(max(price)) as max_price,
    ROUND(min(price)) as min_price 
  FROM product WHERE status = 'active'`;

	const priceRangeResult = await db.query(priceRangeQuery);

	return priceRangeResult;
};
