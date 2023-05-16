// Config
import db from "../../config/connectDB";

export const getAllBrands = async (page: string, searchQuery: string, sortBy: string) => {
	let paramsIndex = 0;
	const params = [];
	const limit = 10;
	const offset = parseInt(page) * limit - limit;

	let query = `SELECT *,
    (SELECT 
      COUNT(*) FROM product p
      WHERE p.brand_id = b.id
    ) AS product_amount  
    FROM brand b`;
	let totalQuery = "SELECT COUNT(id) FROM brand";

	if (searchQuery) {
		query += ` WHERE name iLIKE $${paramsIndex + 1}`;
		totalQuery += " WHERE name iLIKE $1";
		paramsIndex += 1;
		params.push(`%${searchQuery}%`);
	}

	if (sortBy) {
		const sorter = sortBy === "a-z" || sortBy === "z-a" ? "name" : sortBy;
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
    name,
    identifier
  ) VALUES ($1, $2) RETURNING *`;

	const result = await db.query(query, brandData);

	return result.rows[0];
};

export const updateBrand = async (updatedBrand: Array<string>, brandId: string) => {
	const query = `UPDATE brand
    SET name = $1,  
    identifier = $2
    WHERE id = $3 RETURNING *`;

	const result = await db.query(query, [...updatedBrand, brandId]);

	return result.rows[0];
};

export const deleteBrand = async (brandId: string) => {
	const query = `DELETE FROM brand
    WHERE id = $1 RETURNING *`;

	const result = await db.query(query, [brandId]);

	return result.rows[0];
};
