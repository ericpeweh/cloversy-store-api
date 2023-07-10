// Config
import db from "../../../config/connectDB";

// Types
import { Voucher } from "../../interfaces";
import { QueryResult } from "pg";

// Utils
import { ErrorObj } from "../../utils";

export const getUserVouchers = async (userId: string) => {
	const voucherQuery = `SELECT v.voucher_code AS code, v.voucher_title AS title, v.discount, v.discount_type, v.expiry_date
    FROM voucher_dist vd
    JOIN voucher v
    ON v.voucher_code = vd.voucher_code
  WHERE vd.user_id = $1
  AND v.voucher_status = 'active'
  ORDER BY v.created_at DESC
  `;

	const voucherResult = await db.query(voucherQuery, [userId]);
	return voucherResult;
};

export const getSingleVoucher = async (voucherCode: string) => {
	const voucherQuery = "SELECT * FROM voucher WHERE voucher_code = $1";

	const voucherResult: QueryResult<Voucher> = await db.query(voucherQuery, [voucherCode]);

	if (voucherResult.rows.length === 0) {
		throw new ErrorObj.ClientError("Voucher not found!", 404);
	}

	const isVoucherUserScoped = voucherResult.rows[0].voucher_scope === "user";

	let voucherDistResult = [];
	if (isVoucherUserScoped) {
		const voucherDistQuery = `SELECT u.user_id AS user_id, u.email AS email, 
      u.full_name AS full_name, u.profile_picture AS profile_picture
      FROM voucher_dist v
      JOIN users u
      ON v.user_id = u.user_id
      WHERE v.voucher_code = $1`;
		const result = await db.query(voucherDistQuery, [voucherCode]);
		voucherDistResult = result.rows;
	}

	return { voucherResult, selectedUsers: voucherDistResult };
};

export const getVoucherItem = async (voucherCode: string) => {
	const voucherQuery = "SELECT * FROM voucher WHERE voucher_code = $1";

	const voucherResult: QueryResult<Voucher> = await db.query(voucherQuery, [voucherCode]);

	return voucherResult.rows[0];
};
