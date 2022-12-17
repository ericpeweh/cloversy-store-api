export interface Voucher {
	code: string;
	title: string;
	discount: number;
	discount_type: string;
	expiry_date: string;
	status: string;
	usage_limit: number;
	current_usage: number;
	created_at: string;
	voucher_scope: string;
	description: string;
}
