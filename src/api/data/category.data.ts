// Config
import db from "../../config/connectDB";

export const getAllCategories = async (page: string, searchQuery: string, sortBy: string) => {
	let paramsIndex = 0;
	const params = [];
	const limit = 10;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT 
    c.category_id AS id, c.category_name AS name, 
    c.category_identifier AS identifier, 
    c.category_description AS description, c.*,
    (SELECT 
      COUNT(*) FROM product p 
      WHERE p.category_id = c.category_id
    ) AS product_amount 
    FROM category c`;
	let totalQuery = "SELECT COUNT(category_id) FROM category";

	if (searchQuery) {
		query += ` WHERE category_name iLIKE $${paramsIndex + 1}`;
		totalQuery += " WHERE category_name iLIKE $1";
		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	if (sortBy) {
		const sorter =
			sortBy === "a-z" || sortBy === "z-a" ? "name" : sortBy === "id" ? "category_id" : sortBy;
		const sortType = sortBy === "a-z" ? "ASC" : "DESC";

		query += ` ORDER BY ${sorter} ${sortType}`;
	}

	if (page) {
		query += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const categories = await db.query(query, params);
	const totalResult = await db.query(totalQuery, params);
	const totalCategory = totalResult.rows[0].count;

	return {
		categories: categories.rows,
		page: parseInt(page) || "all",
		pageSize: categories.rowCount,
		totalCount: parseInt(totalCategory),
		totalPages: Math.ceil(totalCategory / limit)
	};
};

export const createCategory = async (categoryData: Array<any>) => {
	const query = `INSERT INTO category(
    category_name,
    category_description,
    category_identifier
  ) VALUES ($1, $2, $3) RETURNING *`;

	const result = await db.query(query, categoryData);

	return result.rows[0];
};

export const updateCategory = async (updatedCategory: Array<string>, categoryId: string) => {
	const query = `UPDATE category
    SET category_name = $1,  
    category_description = $2,
    category_identifier = $3
    WHERE category_id = $4 RETURNING *`;

	const result = await db.query(query, [...updatedCategory, categoryId]);

	return result.rows[0];
};

export const deleteCategory = async (categoryId: string) => {
	const query = `DELETE FROM category
    WHERE category_id = $1 RETURNING *`;

	const result = await db.query(query, [categoryId]);

	return result.rows[0];
};
