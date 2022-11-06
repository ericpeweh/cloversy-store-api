// Config
import db from "../../config/connectDB";

export const getAllCategories = async () => {
	const query = "SELECT * FROM category";
	const categories = await db.query(query);

	return categories;
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
