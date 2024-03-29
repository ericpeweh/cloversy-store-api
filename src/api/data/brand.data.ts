// Config
import db from "../../config/connectDB";

export const getAllBrands = async (page: string, searchQuery: string, sortBy: string) => {
	let paramsIndex = 0;
	const params = [];
	const limit = 10;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT 
    b.brand_id AS id, b.brand_name as name, 
    b.brand_identifier as identifier, b.*,
    (SELECT 
      COUNT(*) FROM product p
      WHERE p.brand_id = b.brand_id
    ) AS product_amount  
    FROM brand b`;
	let totalQuery = "SELECT COUNT(brand_id) FROM brand";

	if (searchQuery) {
		query += ` WHERE brand_name iLIKE $${paramsIndex + 1}`;
		totalQuery += " WHERE brand_name iLIKE $1";
		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	if (sortBy) {
		const sorter =
			sortBy === "a-z" || sortBy === "z-a" ? "name" : sortBy === "id" ? "brand_id" : sortBy;
		const sortType = sortBy === "a-z" ? "ASC" : "DESC";

		query += ` ORDER BY ${sorter} ${sortType}`;
	}

	if (page) {
		query += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const brands = await db.query(query, params);
	const totalResult = await db.query(totalQuery, params);
	const totalBrands = totalResult.rows[0].count;

	return {
		brands: brands.rows,
		page: parseInt(page) || "all",
		pageSize: brands.rowCount,
		totalCount: parseInt(totalBrands),
		totalPages: Math.ceil(totalBrands / limit)
	};
};

export const createBrand = async (brandData: Array<any>) => {
	const query = `INSERT INTO brand(
    brand_name,
    brand_identifier
  ) VALUES ($1, $2) RETURNING *`;

	const result = await db.query(query, brandData);

	return result.rows[0];
};

export const updateBrand = async (updatedBrand: Array<string>, brandId: string) => {
	const query = `UPDATE brand
    SET brand_name = $1,  
    brand_identifier = $2
    WHERE brand_id = $3 RETURNING *`;

	const result = await db.query(query, [...updatedBrand, brandId]);

	return result.rows[0];
};

export const deleteBrand = async (brandId: string) => {
	const query = `DELETE FROM brand
    WHERE brand_id = $1 RETURNING *`;

	const result = await db.query(query, [brandId]);

	return result.rows[0];
};
