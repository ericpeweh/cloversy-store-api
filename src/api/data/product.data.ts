// Config
import db from "../../config/connectDB";

// Types
import { UpdateProductDataArgs } from "../interfaces";
import { UploadResponse } from "@google-cloud/storage";

// Utils
import { ErrorObj, generateUpdateQuery } from "../utils";

export const getAllProducts = async (
	page: string,
	searchQuery: string,
	sortBy: string,
	productStatus: string,
	brandFilter: string
) => {
	let paramsIndex = 0;
	const params = [];
	const limit = 12;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT p.*, b.name AS brand, 
    (SELECT url FROM product_image pi 
      WHERE pi.product_id = p.id 
      LIMIT 1
    ) AS image,
    (SELECT ROUND(AVG(rating) / 2, 2) AS rating
      FROM review r
      WHERE r.product_id = p.id AND r.status = 'active'
    )
    FROM product p JOIN brand b
    ON p.brand_id = b.id`;

	let totalQuery = "SELECT COUNT(id) FROM product";

	if (productStatus) {
		query += ` WHERE status = $${paramsIndex + 1}`;
		totalQuery += ` WHERE status = $${paramsIndex + 1}`;
		params.push(productStatus);
		paramsIndex += 1;
	}

	if (brandFilter) {
		const filter = ` ${paramsIndex === 0 ? "WHERE" : "AND"} brand_id = $${paramsIndex + 1}`;
		query += filter;
		totalQuery += filter;
		params.push(brandFilter);
		paramsIndex += 1;
	}

	if (searchQuery) {
		const search = ` ${paramsIndex === 0 ? "WHERE" : "AND"} title iLIKE $${paramsIndex + 1}`;
		query += search;
		totalQuery += search;
		params.push(`%${searchQuery}%`);
		paramsIndex += 1;
	}

	if (sortBy) {
		const sorter = sortBy === "low-to-high" || sortBy === "high-to-low" ? "price" : sortBy;
		const sortType = sortBy === "low-to-high" ? "ASC" : "DESC";

		query += ` ORDER BY ${sorter} ${sortType} NULLS LAST`;
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

export const getSingleProductById = async (productId: string, analyticYear: string) => {
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
  ),
  (SELECT ROUND(AVG(rating) / 2, 2) AS rating
		FROM review r
		WHERE r.product_id = p.id AND r.status = 'active'
	),
	(SELECT COUNT(r.id) AS review_count
		FROM review r
		WHERE r.product_id = p.id AND r.status = 'active'
	)
  FROM product p
  JOIN brand b ON p.brand_id = b.id 
  JOIN category c ON p.category_id = c.id 
  WHERE p.id = $1 
`;
	const productResult = await db.query(productQuery, [productId]);

	if (productResult.rows.length === 0) {
		throw new ErrorObj.ClientError("Product not found!", 404);
	}

	// Get product analytics data (total sales & page views)
	const yearFilter = new Date(analyticYear).toISOString();

	const productSoldAnalyticsQuery = `
    WITH ml(months_list) AS
    (SELECT generate_series(
      date_trunc('year', $1::timestamp),
      date_trunc('year', $1::timestamp) + '11 months',
      '1 month'::interval
    )),
    ti AS
      (SELECT quantity, created_at, order_status
        FROM transactions_item ti
        JOIN transactions t ON ti.transaction_id = t.id
        WHERE ti.product_id = $2
        AND order_status NOT IN ('pending', 'cancel')
        AND date_trunc('year', created_at) = date_trunc('year', $1::timestamp)
      )
    SELECT to_char(ml.months_list, 'Mon') AS month,
      COALESCE(SUM(ti.quantity), 0) AS product_sales
    FROM ml LEFT JOIN ti
      ON ml.months_list = date_trunc('month', ti.created_at)
    GROUP BY ml.months_list
    ORDER BY ml.months_list
  `;

	const productSoldAnalyticsResult = await db.query(productSoldAnalyticsQuery, [
		yearFilter,
		productId
	]);

	return { productResult: productResult.rows[0], analytics: productSoldAnalyticsResult.rows };
};

export const createProduct = async (productData: Array<any>, tags: string[], sizes: string[]) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		const productQuery = `INSERT INTO product(
      title,
      sku,
      price,
      status,
      category_id,
      brand_id,
      description,
      slug
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

		const productResult = await client.query(productQuery, productData);
		const productId = productResult.rows[0].id;

		const tagResult: string[] = [];
		const productTagQuery = `INSERT INTO product_tag(
      product_id,
      tag
    ) VALUES ($1, $2) RETURNING tag`;

		tags.forEach(async tag => {
			const addedTag = await client.query(productTagQuery, [productId, tag]);

			tagResult.push(addedTag.rows[0].tag);
		});

		const sizeResult: string[] = [];
		sizes.forEach(async size => {
			const productSizeQuery = `INSERT INTO product_size(
        product_id,
        size
      ) VALUES ($1, $2) RETURNING size`;

			const addedSize = await client.query(productSizeQuery, [productId, size]);

			sizeResult.push(addedSize.rows[0].size);
		});

		await client.query("COMMIT");
		return { productResult, tagResult, sizeResult };
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const getProductImages = async (productId: string) => {
	const imageQuery = `SELECT url FROM product_image WHERE product_id = $1`;

	const imagesResult = await db.query(imageQuery, [productId]);

	return imagesResult;
};

export const addProductImages = async (productId: string, images: UploadResponse[]) => {
	const imagesResult: string[] = [];

	const imageQuery = `INSERT INTO product_image(
      product_id, 
      url
    ) VALUES ($1, $2) RETURNING url`;

	for (const imageResponse of images) {
		const result = await db.query(imageQuery, [
			productId,
			`https://storage.googleapis.com/cloversy-store/${imageResponse[1].name}`
		]);

		imagesResult.push(result.rows[0].url);
	}

	return imagesResult;
};

export const removeProductImagesWithUrl = async (
	productId: string,
	imagesUrlToDelete: string[]
) => {
	const imageQuery = `DELETE FROM product_image WHERE product_id = $1 AND url = ANY ($2)`;

	const result = await db.query(imageQuery, [productId, imagesUrlToDelete]);

	return result;
};

export const updateProduct = async (updateProductData: UpdateProductDataArgs) => {
	const client = await db.pool.connect();
	const { updatedProductData, productId, tags, sizes, removedTags, removedSizes } =
		updateProductData;

	try {
		await client.query("BEGIN");

		const { query: productQuery, params: productParams } = generateUpdateQuery(
			"product",
			updatedProductData,
			{ id: productId },
			` RETURNING *`
		);

		const productResult = await db.query(productQuery, productParams);

		const tagResult: string[] = [];
		tags.forEach(async tag => {
			const productTagQuery = `INSERT INTO product_tag(
	      product_id,
	      tag
	    ) VALUES ($1, $2) RETURNING tag`;

			const addedTag = await client.query(productTagQuery, [productId, tag]);

			tagResult.push(addedTag.rows[0].tag);
		});

		const sizeResult: string[] = [];
		sizes.forEach(async size => {
			const productSizeQuery = `INSERT INTO product_size(
	      product_id,
	      size
	    ) VALUES ($1, $2) RETURNING size`;

			const addedSize = await client.query(productSizeQuery, [productId, size]);

			sizeResult.push(addedSize.rows[0].size);
		});

		removedTags.forEach(async tag => {
			const tagQuery = `DELETE FROM product_tag WHERE tag = $1 AND product_id = $2`;
			await client.query(tagQuery, [tag, productId]);
		});

		removedSizes.forEach(async size => {
			const sizeQuery = `DELETE FROM product_size WHERE size = $1 AND product_id = $2`;
			await client.query(sizeQuery, [size, productId]);
		});

		const updatedTags = await client.query("SELECT tag FROM product_tag WHERE product_id = $1", [
			productId
		]);
		const filteredUpdatedTags = updatedTags.rows.map(item => item.tag);

		const updatedSizes = await client.query("SELECT size FROM product_size WHERE product_id = $1", [
			productId
		]);
		const filteredUpdatedSizes = updatedSizes.rows.map(item => item.size);

		await client.query("COMMIT");
		return { productResult, filteredUpdatedTags, filteredUpdatedSizes };
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const deleteProduct = async (productId: string) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		const tagQuery = `DELETE FROM product_tag WHERE product_id = $1`;
		await client.query(tagQuery, [productId]);

		const sizeQuery = `DELETE FROM product_size WHERE product_id = $1`;
		await client.query(sizeQuery, [productId]);

		const productQuery = `DELETE FROM product WHERE id = $1 RETURNING id`;
		const productResult = await client.query(productQuery, [productId]);

		await client.query("COMMIT");
		return productResult;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const getProductCount = async () => {
	const productQuery = `SELECT COUNT(id) AS product_count FROM product`;

	const productResult = await db.query(productQuery);

	return productResult.rows[0].product_count;
};
