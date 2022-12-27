// Config
import db from "../../../config/connectDB";

// Types
import { QueryResult } from "pg";
import {
	Address,
	PaymentStatus,
	Transaction,
	TransactionDetailsType,
	TransactionItem,
	TransactionPayment,
	TransactionShipping,
	TransactionStatus,
	TransactionTimelineItem,
	Voucher
} from "../../interfaces";

// Utils
import getLocalTime from "../../utils/getLocalTime";
import { ErrorObj } from "../../utils";

export const createTransaction = async (
	transactionDetails: Omit<TransactionDetailsType, "order_note">
) => {
	const client = await db.pool.connect();

	const {
		chargeResponse,
		shippingCost,
		discount,
		total,
		subtotal,
		user,
		customer_note,
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
      id, user_id, order_status, customer_note, gift_note, voucher_code, discount_total, subtotal, total
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;

		const transactionResult: QueryResult<{ id: number }> = await client.query(transactionQuery, [
			chargeResponse.order_id,
			user.id,
			"pending",
			customer_note,
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
				},
				{
					timeline_date: getLocalTime(),
					description: "Menunggu pembayaran"
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
	const transactionQuery = `SELECT 
    t.id as id, t.user_id as user_id, t.order_status as order_status, 
    t.gift_note as gift_note, t.voucher_code as voucher_code, 
    t.customer_note as customer_note, t.created_at as created_at,
    t.is_reviewed as is_reviewed,
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

export const getTransactionItem = async (transactionId: string) => {
	const transactionQuery = `SELECT * FROM transactions WHERE id = $1`;

	const transactionResult: QueryResult<Transaction> = await db.query(transactionQuery, [
		transactionId
	]);

	return transactionResult?.rows[0];
};

export const getUserTransactions = async (userId: string) => {
	const transactionsQuery = `
    SELECT 
    t.id as id, t.user_id as user_id, t.order_status as order_status, t.is_reviewed as is_reviewed,
    t.created_at as created_at, ROUND(t.total) AS total, 
    (
      SELECT json_agg(json_build_object(
          'product_id', ti.product_id,
          'quantity', ti.quantity,
          'price', ROUND(ti.price),
          'product_size', ti.product_size,
          'title', products.title,
          'slug', products.slug,
          'images', products.images		
      ))
      FROM transactions_item ti
      JOIN (
        SELECT p.id as product_id, p.title as title, p.slug as slug,
          (
            SELECT array_agg("url") AS images 
            FROM product_image pi 
            WHERE pi.product_id = p.id
          )
          FROM product p
      ) AS products 
      ON products.product_id = ti.product_id
      WHERE products.product_id = ti.product_id
      AND ti.transaction_id = t.id
    ) as item_details
    FROM transactions t
    WHERE t.user_id = $1
    ORDER BY t.created_at DESC
  `;

	const transactionResult: QueryResult<
		Transaction & {
			shipping_details: TransactionShipping & Address;
			timeline: TransactionTimelineItem[];
		}
	> = await db.query(transactionsQuery, [userId]);

	return transactionResult.rows;
};

export const updateTransaction = async (
	orderId: string,
	orderStatus: TransactionStatus,
	paymentStatus: PaymentStatus,
	newTimelineItem: TransactionTimelineItem | TransactionTimelineItem[] | null,
	paymentObj: string,
	voucher?: Voucher,
	transaction?: Transaction
) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		// Update transactions
		const transactionsQuery = `UPDATE transactions
      SET order_status = $1, order_status_modified = $2
    WHERE id = $3
    `;

		await client.query(transactionsQuery, [orderStatus, getLocalTime(), orderId]);

		// Update transactions_payment
		const tranasctionsPaymentQuery = `UPDATE transactions_payment
      SET payment_status = $1, payment_status_modified = $2, payment_object = $3
    WHERE transaction_id = $4`;

		await client.query(tranasctionsPaymentQuery, [
			paymentStatus,
			getLocalTime(),
			paymentObj,
			orderId
		]);

		// Update transactions_timeline
		if (newTimelineItem) {
			const transactionsTimelineQuery = `UPDATE transactions_timeline
      SET timeline_object = timeline_object || $1
    WHERE transaction_id = $2`;

			await client.query(transactionsTimelineQuery, [JSON.stringify(newTimelineItem), orderId]);
		}

		// Update voucher data based on type
		let voucherQuery: string | undefined = undefined;
		let voucherParams: string[] = [];
		if (transaction && voucher && voucher?.voucher_scope === "user") {
			voucherQuery = `INSERT INTO voucher_dist 
        (user_id, voucher_code)
      VALUES ($1, $2)`;
			voucherParams = [transaction.user_id, voucher.code];
		}

		if (transaction && voucher && voucher?.voucher_scope === "global") {
			voucherQuery = `UPDATE voucher 
        SET current_usage = current_usage - 1
      WHERE code = $1`;
			voucherParams = [voucher.code];
		}

		if (voucherQuery && voucherParams.length !== 0) {
			await client.query(voucherQuery, voucherParams);
		}

		await client.query("COMMIT");
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const checkTransactionOwnByUser = async (userId: string, transactionId: string) => {
	const transactionQuery = `SELECT id FROM transactions
    WHERE id = $1 AND user_id = $2`;

	const transactionResult = await db.query(transactionQuery, [transactionId, userId]);

	return transactionResult.rowCount !== 0;
};
