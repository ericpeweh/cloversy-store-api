// Config
import db from "../../config/connectDB";

// Types
import { QueryResult } from "pg";
import {
	Address,
	Transaction,
	TransactionItem,
	TransactionPayment,
	TransactionShipping,
	TransactionStatus,
	TransactionTimelineItem,
	UpdateTransactionDataArgs,
	Voucher
} from "../interfaces";

// Utils
import { ErrorObj, generateUpdateQuery, getLocalTime } from "../utils";

export const getTransactions = async (
	userId: string,
	transactionStatus: string,
	searchQuery: string,
	sortBy: string,
	page: string,
	itemsLimit?: string
) => {
	let paramsIndex = 0;
	const params = [];
	const limit = itemsLimit ? +itemsLimit : 12;
	const offset = parseInt(page) * limit - limit;

	let transactionQuery = `SELECT 
      t.transaction_id AS id, t.*, ROUND(t.total) AS total,
      u.full_name AS full_name, u.email AS email
    FROM transactions t
    JOIN users u ON t.user_id = u.user_id`;

	let totalQuery = "SELECT COUNT(transaction_id) FROM transactions t";

	if (transactionStatus) {
		transactionQuery += ` WHERE t.order_status = $${paramsIndex + 1}`;
		totalQuery += ` WHERE t.order_status = $${paramsIndex + 1}`;
		params.push(transactionStatus);
		paramsIndex += 1;
	}

	if (userId) {
		const filter = ` ${paramsIndex === 0 ? "WHERE" : "AND"} t.user_id = $${paramsIndex + 1}`;
		transactionQuery += filter;
		totalQuery += filter;
		params.push(userId);
		paramsIndex += 1;
	}

	if (searchQuery) {
		const search = ` ${paramsIndex === 0 ? "WHERE" : "AND"} t.transaction_id iLIKE $${
			paramsIndex + 1
		}`;
		transactionQuery += search;
		totalQuery += search;
		params.push(`%${searchQuery}%`);
		paramsIndex += 1;
	}

	if (sortBy) {
		const sorter =
			sortBy === "low-to-high" || sortBy === "high-to-low"
				? "total"
				: sortBy === "id"
				? "transaction_id"
				: sortBy;
		const sortType = sortBy === "low-to-high" ? "ASC" : "DESC";

		transactionQuery += ` ORDER BY t.${sorter} ${sortType} NULLS LAST`;
	}

	if (page) {
		transactionQuery += ` LIMIT ${limit} OFFSET ${offset}`;
	}

	const totalTransactions = (await db.query(totalQuery, params)).rows[0].count;
	const transactions = await db.query(transactionQuery, params);

	return {
		transactions,
		page: parseInt(page),
		pageSize: limit,
		totalCount: parseInt(totalTransactions),
		totalPages: Math.ceil(totalTransactions / limit)
	};
};

export const getTransactionItem = async (transactionId: string) => {
	const transactionQuery =
		"SELECT t.transaction_id AS id, t.* FROM transactions t WHERE t.trannsaction_id = $1";

	const transactionResult: QueryResult<Transaction> = await db.query(transactionQuery, [
		transactionId
	]);

	return transactionResult?.rows[0];
};

export const getSingleTransaction = async (transactionId: string) => {
	const transactionQuery = `SELECT 
    t.transaction_id AS id, t.user_id AS user_id, 
    t.order_status AS order_status, 
    t.gift_note AS gift_note, t.voucher_code AS voucher_code, 
    t.customer_note AS customer_note, t.order_note AS order_note, t.created_at AS created_at,
    t.is_reviewed AS is_reviewed, t.order_status_modified AS order_status_modified, 
    ROUND(t.subtotal) AS subtotal, 
    ROUND(t.discount_total) AS discount_total,
    ROUND(t.total) AS total,
    to_json(ts) AS shipping_details,
    tt.timeline_object as timeline,
    u.full_name AS full_name, u.email AS email, u.user_contact AS contact,
    v.voucher_title AS voucher_title, v.discount_type AS voucher_discount_type, v.discount AS voucher_discount
  FROM transactions t
    JOIN transactions_shipping ts ON t.transaction_id = ts.transaction_id
    JOIN transactions_timeline tt ON t.transaction_id = tt.transaction_id
    JOIN users u ON t.user_id = u.user_id
    LEFT JOIN voucher v ON t.voucher_code = v.voucher_code
  WHERE t.transaction_id = $1
    `;

	const transactionResult: QueryResult<
		Transaction & {
			full_name: string;
			emaiL: string;
			contact: string;
			voucher_title: string;
			voucher_discount_type: "value" | "percentage";
			voucher_discount: number;
			shipping_details: TransactionShipping & Address;
			timeline: TransactionTimelineItem[];
		}
	> = await db.query(transactionQuery, [transactionId.toUpperCase()]);

	if (transactionResult.rows.length === 0) throw new ErrorObj.ClientError("Transaction not found!");

	const transactionPaymentQuery = `SELECT * FROM transactions_payment
  WHERE transaction_id = $1`;

	const transactionPaymentResult: QueryResult<TransactionPayment> = await db.query(
		transactionPaymentQuery,
		[transactionId]
	);

	const transactionItemsQuery = `SELECT 
    ti.transaction_item_id AS id, ti.*, 
    products.*, ROUND(ti.price) AS price 
  FROM transactions_item ti
  JOIN (
    SELECT p.product_id AS product_id, p.product_title AS title, p.product_slug AS slug,
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.product_id
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

export const updateTransaction = async (updateTransactionData: UpdateTransactionDataArgs) => {
	const client = await db.pool.connect();
	const { transactionId, updatedTransactionData, timelineObj, shippingTrackingCode } =
		updateTransactionData;

	try {
		await client.query("BEGIN");

		const { query: transactionQuery, params: transactionParams } = generateUpdateQuery(
			"transactions",
			updatedTransactionData,
			{ transaction_id: transactionId },
			"",
			undefined,
			[
				"transaction_id",
				"user_id",
				"order_status",
				"order_status_modified",
				"voucher_code",
				"discount_total",
				"subtotal",
				"total",
				"created_at",
				"is_reviewed"
			]
		);

		const transactionResult = await client.query(transactionQuery, transactionParams);

		let timelineResult;
		if (timelineObj) {
			timelineResult = await client.query(
				"UPDATE transactions_timeline SET timeline_object = $1 WHERE transaction_id = $2 RETURNING *",
				[timelineObj, transactionId]
			);
		}

		await client.query(
			"UPDATE transactions_shipping SET shipping_tracking_code = $1 WHERE transaction_id = $2",
			[shippingTrackingCode, transactionId]
		);

		await client.query("COMMIT");
		return { transactionResult, timelineResult };
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};

export const changeTransactionStatus = async (
	transactionId: string,
	orderStatus: TransactionStatus,
	paymentStatus: "pending" | "settlement" | "cancel",
	newTimelineItem: TransactionTimelineItem,
	paymentObj: string | null,
	voucher: Voucher | undefined,
	transaction: Transaction
) => {
	const client = await db.pool.connect();

	try {
		await client.query("BEGIN");

		// Update transaction status
		const transactionQuery = `UPDATE transactions
      SET order_status = $1, order_status_modified = $2 
    WHERE transaction_id = $3`;

		await client.query(transactionQuery, [orderStatus, getLocalTime(), transactionId]);

		// Update transaction timeline
		const transactionTimelineQuery = `UPDATE transactions_timeline 
      SET timeline_object = timeline_object || $1
    WHERE transaction_id = $2 `;

		await client.query(transactionTimelineQuery, [JSON.stringify(newTimelineItem), transactionId]);

		// Update transaction payment status (not modifying payment_object)
		const transactionPaymentQuery = `UPDATE transactions_payment
      SET payment_status = $1, payment_status_modified = $2
    WHERE transaction_id = $3`;

		await client.query(transactionPaymentQuery, [paymentStatus, getLocalTime(), transactionId]);

		// Update payment obj if existed
		if (paymentObj) {
			const transactionPaymentObjQuery = `UPDATE transactions_payment
      SET payment_object = $1 WHERE transaction_id = $2`;

			await client.query(transactionPaymentObjQuery, [paymentObj, transactionId]);
		}

		// Update voucher data based on type (if order status is cancel / )
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
      WHERE voucher_code = $1`;
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

export const getSalesTotal = async () => {
	const transactionQuery = `SELECT 
    ROUND(SUM(total)) AS total_sales 
      FROM transactions
    WHERE order_status NOT IN ('pending', 'cancel')
  `;

	const transactionResult = await db.query(transactionQuery);

	return transactionResult.rows[0].total_sales;
};

export const getTransactionCount = async () => {
	const transactionQuery = "SELECT COUNT(transaction_id) AS transaction_count FROM transactions";

	const transactionResult = await db.query(transactionQuery);

	return transactionResult.rows[0].transaction_count;
};

export const getMonthlySalesCountAnalytics = async (analyticYear: string) => {
	const transactionAnalyticsQuery = `
    WITH ml(months_list) AS
      (SELECT generate_series(
        date_trunc('year', $1::timestamp), 
        date_trunc('year', $1::timestamp) + '11 months', 
        '1 month'::interval
      )),
    t AS 
      (SELECT transaction_id AS id, created_at, order_status
        FROM transactions
        WHERE order_status NOT IN ('pending', 'cancel')
        AND date_trunc('year', created_at) = date_trunc('year', $1::timestamp)
      )
    SELECT to_char(ml.months_list, 'Mon') AS month,
      COUNT(t.id) AS sales_count
    FROM ml 
    LEFT JOIN t
      ON ml.months_list = date_trunc('month', t.created_at)
    GROUP BY ml.months_list
    ORDER BY ml.months_list`;

	const yearFilter = new Date(analyticYear).toISOString();

	const transactionAnalyticsResult = await db.query(transactionAnalyticsQuery, [yearFilter]);

	return transactionAnalyticsResult.rows;
};
