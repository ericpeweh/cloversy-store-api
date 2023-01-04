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

	let voucherQuery = `SELECT * FROM voucher`;

	let totalQuery = `SELECT COUNT(code) FROM voucher`;

	if (voucherStatus) {
		voucherQuery += ` WHERE status = $${paramsIndex + 1}`;
		totalQuery += ` WHERE status = $${paramsIndex + 1}`;
		params.push(voucherStatus);
		paramsIndex += 1;
	}

	if (sortBy && sortBy !== "id") {
		voucherQuery += ` ORDER BY ${sortBy} ASC`;
	}

	if (sortBy === "id") {
		voucherQuery += ` ORDER BY created_at DESC`;
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

export const getSingleVoucher = async (voucherCode: string) => {
	const voucherQuery = `SELECT * FROM voucher WHERE code = $1`;

	const voucherResult = await db.query(voucherQuery, [voucherCode]);

	if (voucherResult.rows.length === 0) {
		throw new ErrorObj.ClientError("Voucher not found!", 404);
	}

	const isVoucherUserScoped = voucherResult.rows[0].voucher_scope === "user";

	let voucherDistResult = [];
	if (isVoucherUserScoped) {
		const voucherDistQuery = `SELECT u.id AS user_id, u.email AS email, 
      u.full_name AS full_name, u.profile_picture AS profile_picture
      FROM voucher_dist v
      JOIN users u
      ON v.user_id = u.id
      WHERE v.voucher_code = $1`;
		const result = await db.query(voucherDistQuery, [voucherCode]);
		voucherDistResult = result.rows;
	}

	return { voucherResult, selectedUsers: voucherDistResult };
};

export const createVoucher = async (
	voucherData: Array<any>,
	selectedUserIds: string[] | number[]
) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		const voucherQuery = `INSERT INTO voucher(
      code,
      title,
      expiry_date,
      discount,
      discount_type,
      status,
      voucher_scope,
      description
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

		const voucherResult = await client.query(voucherQuery, voucherData);
		const newVoucherCode = voucherResult.rows[0].code;

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
      title = $1,
      expiry_date = $2,
      discount = $3,
      discount_type = $4,
      status = $5,
      voucher_scope = $6,
      description = $7
      WHERE code = $8 RETURNING *`;

		const voucherResult = await client.query(voucherQuery, [...updatedVoucherData, code]);
		const isVoucherGlobalScoped = voucherResult.rows[0].voucher_scope === "global";

		if (isVoucherGlobalScoped) {
			const voucherDistRemoveQuery = `DELETE FROM voucher_dist WHERE voucher_code = $1`;

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
	const voucherQuery = `SELECT * FROM voucher WHERE code = $1`;

	const voucherResult: QueryResult<Voucher> = await db.query(voucherQuery, [voucherCode]);

	return voucherResult.rows[0];
};
