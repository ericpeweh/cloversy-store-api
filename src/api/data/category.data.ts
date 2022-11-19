// Config
import db from "../../config/connectDB";

export const getAllCategories = async (page: string, searchQuery: string, sortBy: string) => {
	let paramsIndex = 0;
	const params = [];
	const limit = 10;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT *,
    (SELECT 
      COUNT(*) FROM product p 
      WHERE p.category_id = c.id
    ) AS product_amount 
    FROM category c`;
	let totalQuery = `SELECT COUNT(id) FROM category`;

	if (searchQuery) {
		query += ` WHERE name iLIKE $${paramsIndex + 1}`;
		totalQuery += ` WHERE name iLIKE $1`;
		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	if (sortBy) {
		const sorter = sortBy === "a-z" || sortBy === "z-a" ? "name" : sortBy;
		const sortType = sortBy === "a-z" ? "ASC" : "DESC";

		query += ` ORDER BY ${sorter} ${sortType}`;
	}
	query += ` LIMIT ${limit} OFFSET ${offset}`;

	const categories = await db.query(query, params);
	const totalResult = await db.query(totalQuery, params);
	const totalCategory = totalResult.rows[0].count;

	return {
		categories,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalCategory),
		totalPages: Math.ceil(totalCategory / limit)
	};
};

export const createCategory = async (categoryData: Array<any>) => {
	const query = `INSERT INTO category(
    name,
    description,
    identifier
  ) VALUES ($1, $2, $3) RETURNING *`;

	const result = await db.query(query, categoryData);

	return result;
};

export const updateCategory = async (updatedCategory: Array<string>, categoryId: string) => {
	const query = `UPDATE category
    SET name = $1,  
    description = $2,
    identifier = $3
    WHERE id = $4 RETURNING *`;

	const result = await db.query(query, [...updatedCategory, categoryId]);

	return result;
};

export const deleteCategory = async (categoryId: string) => {
	const query = `DELETE FROM category
    WHERE id = $1 RETURNING *`;

	const result = await db.query(query, [categoryId]);

	return result;
};
