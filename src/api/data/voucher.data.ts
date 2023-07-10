// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";
import { Voucher } from "../interfaces";

// Utils
import { ErrorObj } from "../utils";

export const getAllVouchers = async (
	voucherStatus: string,
	sortBy: string,
	page: string,
	itemsLimit: string
) => {
	let paramsIndex = 0;
	const params = [];
	const limit = itemsLimit ? +itemsLimit : 12;
	const offset = parseInt(page) * limit - limit;

	let voucherQuery = `SELECT 
    v.voucher_code AS code, v.voucher_title AS title,
    v.voucher_status AS status, v.*
    FROM voucher v`;

	let totalQuery = "SELECT COUNT(voucher_code) FROM voucher";

	if (voucherStatus) {
		voucherQuery += ` WHERE voucher_status = $${paramsIndex + 1}`;
		totalQuery += ` WHERE voucher_status = $${paramsIndex + 1}`;
		params.push(voucherStatus);
		paramsIndex += 1;
	}

	if (sortBy && sortBy !== "id") {
		voucherQuery += ` ORDER BY ${sortBy} ASC`;
	}

	if (sortBy === "id") {
		voucherQuery += " ORDER BY created_at DESC";
	}

	if (page) {
		voucherQuery += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const totalVouchers = (await db.query(totalQuery, params)).rows[0].count;
	const vouchers = (await db.query(voucherQuery, params)).rows;

	return {
		vouchers,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalVouchers),
		totalPages: Math.ceil(totalVouchers / limit)
	};
};

export const getSingleVoucher = async (voucherCode: string, analyticYear: string) => {
	const voucherQuery = `SELECT
    v.voucher_code AS code, v.voucher_title AS title,
    v.voucher_status AS status, v.* 
    FROM voucher v
    WHERE v.voucher_code = $1`;

	const voucherResult = await db.query(voucherQuery, [voucherCode]);

	if (voucherResult.rows.length === 0) {
		throw new ErrorObj.ClientError("Voucher not found!", 404);
	}

	const isVoucherUserScoped = voucherResult.rows[0].voucher_scope === "user";

	let voucherDistResult = [];
	if (isVoucherUserScoped) {
		const voucherDistQuery = `SELECT 
      u.user_id AS user_id, u.email AS email, 
      u.full_name AS full_name, u.profile_picture AS profile_picture
      FROM voucher_dist v
      JOIN users u
      ON v.user_id = u.user_id
      WHERE v.voucher_code = $1`;
		const result = await db.query(voucherDistQuery, [voucherCode]);
		voucherDistResult = result.rows;
	}

	const voucherAnalyticsQuery = `
    WITH ml(months_list) AS
      (SELECT generate_series(
        date_trunc('year', $1::timestamp), 
        date_trunc('year', $1::timestamp) + '11 months', 
      '1 month'::interval
      )),
    t AS 
      (SELECT transaction_id AS id, discount_total, created_at, voucher_code
        FROM transactions
        WHERE voucher_code = $2
        AND order_status NOT IN ('pending', 'cancel')
        AND date_trunc('year', created_at) = date_trunc('year', $1::timestamp)
      )
    SELECT to_char(ml.months_list, 'Mon') AS month,
      COUNT(t.id) AS voucher_usage,
      ROUND(COALESCE(SUM(t.discount_total), 0)) AS discount_total
    FROM ml LEFT JOIN t
      ON ml.months_list = date_trunc('month', t.created_at)
    GROUP BY ml.months_list
    ORDER BY ml.months_list`;

	const yearFilter = new Date(analyticYear).toISOString();

	const voucherAnalyticsResult = await db.query(voucherAnalyticsQuery, [yearFilter, voucherCode]);

	return {
		voucherResult,
		analytics: voucherAnalyticsResult.rows,
		selectedUsers: voucherDistResult
	};
};

export const createVoucher = async (
	voucherData: Array<any>,
	selectedUserIds: string[] | number[]
) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		const voucherQuery = `INSERT INTO voucher(
      voucher_code,
      voucher_title,
      expiry_date,
      discount,
      discount_type,
      voucher_status,
      usage_limit,
      voucher_scope,
      description
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

		const voucherResult: QueryResult<Voucher & { voucher_code: string }> = await client.query(
			voucherQuery,
			voucherData
		);
		const newVoucherCode = voucherResult.rows[0].voucher_code;

		if (selectedUserIds.length > 0) {
			const voucherDistQuery = `INSERT INTO voucher_dist(
        user_id,
        voucher_code
      ) VALUES ($1, $2) RETURNING *`;

			selectedUserIds.forEach(async userId => {
				await client.query(voucherDistQuery, [userId, newVoucherCode]);
			});
		}

		await client.query("COMMIT");
		return voucherResult;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const updateVoucher = async (
	updatedVoucherData: any[],
	selectedUserIds: string[] | number[],
	removedUserIds: string[] | number[],
	code: string
) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		const voucherQuery = `UPDATE voucher SET
      voucher_title = $1,
      expiry_date = $2,
      discount = $3,
      discount_type = $4,
      voucher_status = $5,
      usage_limit = $6,
      voucher_scope = $7,
      description = $8
      WHERE voucher_code = $9 RETURNING *`;

		const voucherResult = await client.query(voucherQuery, [...updatedVoucherData, code]);
		const isVoucherGlobalScoped = voucherResult.rows[0].voucher_scope === "global";

		if (isVoucherGlobalScoped) {
			const voucherDistRemoveQuery = "DELETE FROM voucher_dist WHERE voucher_code = $1";

			await client.query(voucherDistRemoveQuery, [code]);
		}

		if (!isVoucherGlobalScoped && selectedUserIds.length > 0) {
			const voucherDistQuery = `INSERT INTO voucher_dist(
        user_id,
        voucher_code
      ) VALUES ($1, $2)`;

			selectedUserIds.forEach(async userId => {
				await client.query(voucherDistQuery, [userId, code]);
			});
		}

		if (!isVoucherGlobalScoped && removedUserIds.length > 0) {
			const voucherDistRemoveQuery = `DELETE FROM voucher_dist 
        WHERE user_id = $1
        AND voucher_code = $2`;

			removedUserIds.forEach(async userId => {
				await client.query(voucherDistRemoveQuery, [userId, code]);
			});
		}

		await client.query("COMMIT");
		return voucherResult;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const getVoucherItem = async (voucherCode: string) => {
	const voucherQuery = `SELECT
    v.voucher_code AS code, v.voucher_title AS title,
    v.voucher_status AS status, v.*
    FROM voucher v
    WHERE v.voucher_code = $1`;

	const voucherResult: QueryResult<Voucher> = await db.query(voucherQuery, [voucherCode]);

	return voucherResult.rows[0];
};

export const getActiveVoucherCount = async () => {
	const reviewQuery = `SELECT COUNT(voucher_code) AS active_voucher_count 
    FROM voucher
  WHERE voucher_status = 'active'
  AND current_usage < usage_limit
  AND expiry_date > NOW() 
  `;

	const reviewResult = await db.query(reviewQuery);

	return reviewResult.rows[0].active_voucher_count;
};
