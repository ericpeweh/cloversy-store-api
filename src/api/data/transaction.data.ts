// Config
import db from "../../config/connectDB";

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
	UpdateTransactionDataArgs,
	Voucher
} from "../interfaces";

// Utils
import { ErrorObj, generateUpdateQuery } from "../utils";

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

	let transactionQuery = `SELECT t.*, ROUND(t.total) as total,
      u.full_name as full_name, u.email as email
    FROM transactions t
    JOIN users u ON t.user_id = u.id`;

	let totalQuery = "SELECT COUNT(id) FROM transactions t";

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
		const search = ` ${paramsIndex === 0 ? "WHERE" : "AND"} t.id iLIKE $${paramsIndex + 1}`;
		transactionQuery += search;
		totalQuery += search;
		params.push(`%${searchQuery}%`);
		paramsIndex += 1;
	}

	if (sortBy) {
		const sorter = sortBy === "low-to-high" || sortBy === "high-to-low" ? "total" : sortBy;
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

export const getSingleTransaction = async (transactionId: string) => {
	const transactionQuery = `SELECT 
    t.id as id, t.user_id as user_id, t.order_status as order_status, 
    t.gift_note as gift_note, t.voucher_code as voucher_code, 
    t.customer_note as customer_note, t.order_note as order_note, t.created_at as created_at,
    t.is_reviewed as is_reviewed, t.order_status_modified as order_status_modified, 
    ROUND(t.subtotal) AS subtotal, 
    ROUND(t.discount_total) AS discount_total,
    ROUND(t.total) AS total,
    to_json(ts) AS shipping_details,
    tt.timeline_object as timeline,
    u.full_name as full_name, u.email as email, u.contact as contact,
    v.title as voucher_title, v.discount_type as voucher_discount_type, v.discount as voucher_discount
  FROM transactions t
    JOIN transactions_shipping ts ON t.id = ts.transaction_id
    JOIN transactions_timeline tt ON t.id = tt.transaction_id
    JOIN users u ON t.user_id = u.id
    LEFT JOIN voucher v ON t.voucher_code = v.code
  WHERE t.id = $1
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

export const updateTransaction = async (updateTransactionData: UpdateTransactionDataArgs) => {
	const client = await db.pool.connect();
	const { transactionId, updatedTransactionData, timelineObj, shippingTrackingCode } =
		updateTransactionData;

	try {
		await client.query("BEGIN");

		const { query: transactionQuery, params: transactionParams } = generateUpdateQuery(
			"transactions",
			updatedTransactionData,
			{ id: transactionId },
			"",
			undefined,
			[
				"id",
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
				`UPDATE transactions_timeline SET timeline_object = $1 WHERE transaction_id = $2 RETURNING *`,
				[timelineObj, transactionId]
			);
		}

		if (shippingTrackingCode) {
			await client.query(
				`UPDATE transactions_shipping SET shipping_tracking_code = $1 WHERE transaction_id = $2`,
				[shippingTrackingCode, transactionId]
			);
		}

		await client.query("COMMIT");
		return { transactionResult, timelineResult };
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	} finally {
		client.release();
	}
};
