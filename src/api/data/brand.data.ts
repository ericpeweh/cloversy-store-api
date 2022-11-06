// Config
import db from "../../config/connectDB";

export const getAllBrands = async () => {
	const query = "SELECT * FROM brand";
	const brands = await db.query(query);

	return brands;
};

export const createBrand = async (brandData: Array<any>) => {
	const query = `INSERT INTO brand(
    name,
    identifier
  ) VALUES ($1, $2) RETURNING *`;

	const result = await db.query(query, brandData);

	return result;
};

export const updateBrand = async (updatedBrand: Array<string>, brandId: string) => {
	const query = `UPDATE brand
    SET name = $1,  
    identifier = $2
    WHERE id = $3 RETURNING *`;

	const result = await db.query(query, [...updatedBrand, brandId]);

	return result;
};

export const deleteBrand = async (brandId: string) => {
	const query = `DELETE FROM brand
    WHERE id = $1 RETURNING *`;

	const result = await db.query(query, [brandId]);

	return result;
};
