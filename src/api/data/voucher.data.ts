// Config
import db from "../../config/connectDB";

export const createVoucher = async (voucherData: Array<any>, selectedUserIds: Array<any>) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		const voucherQuery = `INSERT INTO voucher(
      code,
      title,
      expiry_date,
      discount,
      discount_type,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

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
