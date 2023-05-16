// Config
import db from "../../../config/connectDB";

// Types
import { Voucher } from "../../interfaces";
import { QueryResult } from "pg";

// Utils
import { ErrorObj } from "../../utils";

export const getUserVouchers = async (userId: string) => {
	const voucherQuery = `SELECT  v.code, v.title, v.discount, v.discount_type, v.expiry_date
    FROM voucher_dist vd
    JOIN voucher v
    ON v.code = vd.voucher_code
  WHERE user_id = $1
  AND status = 'active'
  ORDER BY created_at DESC
  `;

	const voucherResult = await db.query(voucherQuery, [userId]);
	return voucherResult;
};

export const getSingleVoucher = async (voucherCode: string) => {
	const voucherQuery = "SELECT * FROM voucher WHERE code = $1";

	const voucherResult: QueryResult<Voucher> = await db.query(voucherQuery, [voucherCode]);

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

export const getVoucherItem = async (voucherCode: string) => {
	const voucherQuery = "SELECT * FROM voucher WHERE code = $1";

	const voucherResult: QueryResult<Voucher> = await db.query(voucherQuery, [voucherCode]);

	return voucherResult.rows[0];
};
