// Config
import db from "../../config/connectDB";

// Types
import { ProductType } from "../interfaces";

const getAllProducts = async () => {
	const query = "SELECT * FROM product";
	const products = await db.query(query);

	return products;
};

const createProduct = async (postData: Array<any>) => {
	const query = `INSERT INTO product(
    title,
    sku,
    price,
    status,
    category_id,
    brand_id,
    description,
    slug
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

	const result = await db.query(query, postData);

	return result;
};

const updateProduct = async (updatedPostData: Array<any>) => {
	const query = `UPDATE product
    SET title = $1,  
    sku = $2,
    price = $3,
    status = $4,
    category_id = $5,
    brand_id,
    description,
    slug`;
};

export { getAllProducts, createProduct };
