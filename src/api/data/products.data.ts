// Config
import db from "../../config/connectDB";

// Types
import { UpdateProductDataArgs } from "../interfaces";

// Utils
import { ErrorObj } from "../utils";

export const getAllProducts = async () => {
	const query = "SELECT * FROM product";
	const products = await db.query(query);

	return products;
};

export const getSingleProduct = async (productId: string, productSlug: string) => {
	const productQuery = "SELECT * FROM product WHERE id = $1 AND slug = $2";
	const productResult = await db.query(productQuery, [productId, productSlug]);

	if (productResult.rows.length === 0) {
		throw new ErrorObj.ClientError("Product not found!", 404);
	}

	const tags = await db.query("SELECT tag FROM product_tag WHERE product_id = $1", [productId]);
	const filteredTags = tags.rows.map(item => item.tag);

	const sizes = await db.query("SELECT size FROM product_size WHERE product_id = $1", [productId]);
	const filteredSizes = sizes.rows.map(item => item.size);

	return { productResult, filteredTags, filteredSizes };
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

import generateUpdateQuery from "../utils/generateUpdateQuery";

export const updateProduct = async (updateProductData: UpdateProductDataArgs) => {
	const client = await db.pool.connect();
	const { updatedProductData, productId, tags, sizes, deleteTagsId, deleteSizesId } =
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

		deleteTagsId.forEach(async tagId => {
			const tagQuery = `DELETE FROM product_tag WHERE id = $1 AND product_id = $2`;
			await client.query(tagQuery, [tagId, productId]);
		});

		deleteSizesId.forEach(async sizeId => {
			const sizeQuery = `DELETE FROM product_size WHERE id = $1 AND product_id = $2`;
			await client.query(sizeQuery, [sizeId, productId]);
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
