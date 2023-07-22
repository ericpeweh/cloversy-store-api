// Config
import db from "../../config/connectDB";

// Types
import { SalesReportItemData } from "../interfaces";
import { QueryResult } from "pg";

export const getSalesReport = async (startDate: string, endDate: string) => {
	const salesReportQuery = `SELECT 
    t.transaction_id, ROUND(t.subtotal) AS subtotal, 
    ROUND(t.discount_total) AS discount_total, 
    ROUND(t.total) AS total, t.created_at, t.voucher_code, 
    p.product_title, ti.quantity, ti.product_size
  FROM transactions_item ti
  JOIN transactions t ON t.transaction_id = ti.transaction_id
  JOIN product p ON p.product_id = ti.product_id
  WHERE t.order_status NOT IN ('pending', 'cancel')
  AND t.created_at::DATE BETWEEN $1 AND $2
  ORDER BY t.created_at DESC
  `;

	const salesReportResult: QueryResult<SalesReportItemData[]> = await db.query(salesReportQuery, [
		startDate,
		endDate
	]);

	return salesReportResult.rows;
};
