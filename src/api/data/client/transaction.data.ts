// Config
import db from "../../../config/connectDB";

// Types
import { QueryResult } from "pg";
import {
	Address,
	Transaction,
	TransactionDetailsType,
	TransactionItem,
	TransactionPayment,
	TransactionShipping,
	TransactionTimelineItem
} from "../../interfaces";

// Utils
import getLocalTime from "../../utils/getLocalTime";
import { ErrorObj } from "../../utils";

export const createTransaction = async (transactionDetails: TransactionDetailsType) => {
	const client = await db.pool.connect();

	const {
		chargeResponse,
		shippingCost,
		discount,
		total,
		subtotal,
		user,
		order_note,
		gift_note,
		userCartItems,
		selectedAddress,
		selectedShipping,
		selectedVoucher,
		paymentMethod
	} = transactionDetails;

	try {
		await client.query("BEGIN");

		// Create transaction record
		const transactionQuery = `INSERT INTO transactions(
      id, user_id, order_status, order_note, gift_note, voucher_code, discount_total, subtotal, total
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;

		const transactionResult: QueryResult<{ id: number }> = await client.query(transactionQuery, [
			chargeResponse.order_id,
			user.id,
			"pending",
			order_note,
			gift_note,
			selectedVoucher?.code || null,
			discount,
			subtotal,
			total
		]);
		const transactionId = transactionResult.rows[0].id;

		// Create transaction item list records
		const transactionItemQuery = `INSERT INTO transactions_item(
      transaction_id, product_id, quantity, price, product_size
    ) VALUES ($1, $2, $3, $4, $5)
    `;

		for (const cartItem of userCartItems) {
			const { product_id, quantity, price, size } = cartItem;

			await client.query(transactionItemQuery, [transactionId, product_id, quantity, price, size]);
		}

		// Create transaction payment record
		const transactionPaymentQuery = `INSERT INTO transactions_payment(
      transaction_id, payment_method, payment_status, payment_object
    ) VALUES ($1, $2, $3, $4)
    `;

		await client.query(transactionPaymentQuery, [
			transactionId,
			paymentMethod,
			chargeResponse.transaction_status,
			chargeResponse
		]);

		// Create transaction shipping record
		const transactionShippingQuery = `INSERT INTO transactions_shipping(
      transaction_id, shipping_cost, shipping_courier, shipping_service, recipient_name, contact, address, province, province_id, city, city_id, subdistrict, subdistrict_id, postal_code, label, shipping_note, shipping_etd
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;
		const { courier, service, etd } = selectedShipping;
		const {
			address,
			recipient_name,
			contact,
			province,
			province_id,
			city,
			city_id,
			subdistrict,
			subdistrict_id,
			postal_code,
			label,
			shipping_note
		} = selectedAddress;

		await client.query(transactionShippingQuery, [
			transactionId,
			shippingCost,
			courier,
			service,
			recipient_name,
			contact,
			address,
			province,
			province_id,
			city,
			city_id,
			subdistrict,
			subdistrict_id,
			postal_code,
			label,
			shipping_note,
			etd
		]);

		// Create transaction payment record
		const transactionTimelineQuery = `INSERT INTO transactions_timeline(
      transaction_id, timeline_object
    ) VALUES ($1, $2)
    `;

		await client.query(transactionTimelineQuery, [
			transactionId,
			JSON.stringify([
				{
					timeline_date: getLocalTime(),
					description: "Pesanan telah dibuat"
				}
			])
		]);

		// Update voucher if using voucher
		if (selectedVoucher) {
			const voucherUsageQuery = `UPDATE voucher 
        SET current_usage = current_usage + 1 
      WHERE code = $1`;

			await client.query(voucherUsageQuery, [selectedVoucher.code]);
		}

		// Remove user from voucher_dist if voucher_scope is user
		if (selectedVoucher && selectedVoucher.voucher_scope === "user") {
			const voucherDistRemoveQuery = `DELETE FROM voucher_dist 
      WHERE user_id = $1 AND voucher_code = $2`;

			await client.query(voucherDistRemoveQuery, [user.id, selectedVoucher.code]);
		}

		// Clear user cart
		await client.query("DELETE FROM cart WHERE user_id = $1", [user.id]);

		await client.query("COMMIT");
		return transactionId;
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const getSingleTransaction = async (userId: string, transactionId: string) => {
	const transactionQuery = `SELECT t.*, 
    ROUND(t.subtotal) AS subtotal, 
    ROUND(t.discount_total) AS discount_total,
    ROUND(t.total) AS total,
    to_json(ts) AS shipping_details,
    tt.timeline_object as timeline
  FROM transactions t
    JOIN transactions_shipping ts ON t.id = ts.transaction_id
    JOIN transactions_timeline tt ON t.id = tt.transaction_id
  WHERE user_id = $1 AND id = $2
    `;

	const transactionResult: QueryResult<
		Transaction & {
			shipping_details: TransactionShipping & Address;
			timeline: TransactionTimelineItem[];
		}
	> = await db.query(transactionQuery, [userId, transactionId]);

	if (transactionResult.rows.length === 0) throw new ErrorObj.ClientError("Transaction not found!");

	const transactionPaymentQuery = `SELECT * FROM transactions_payment
  WHERE transaction_id = $1`;

	const transactionPaymentResult: QueryResult<TransactionPayment> = await db.query(
		transactionPaymentQuery,
		[transactionId]
	);

	const transactionItemsQuery = `SELECT ti.*, products.*, ROUND(ti.price) AS price FROM transactions_item ti
  JOIN (
    SELECT p.id as product_id, p.title as title, p.slug as slug,
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.id
    )
    FROM product p
  ) AS products 
  ON products.product_id = ti.product_id
  WHERE products.product_id = ti.product_id
  AND ti.transaction_id = $1`;

	const transactionItemsResult: QueryResult<TransactionItem> = await db.query(
		transactionItemsQuery,
		[transactionId]
	);

	return {
		transaction: transactionResult.rows[0],
		payment: transactionPaymentResult.rows[0],
		items: transactionItemsResult.rows
	};
};
