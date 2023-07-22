export interface SalesReportItemData {
	transaction_id: number;
	subtotal: number;
	discount_total: number;
	total: number;
	created_at: string;
	voucher_code: null | string;
	product_title: string;
	quantity: number;
	product_size: string;
}
