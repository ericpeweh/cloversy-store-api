import { Address } from "./address.interface";
import { CartItemDetails } from "./cart.interface";
import { CostItem } from "./data.interface";
import { User } from "./user.interface";
import { Voucher } from "./voucher.interface";

export type PaymentMethod = "gopay" | "bni" | "mandiri" | "permata" | "bri";

export type PaymentType = "gopay" | "bank_transfer" | "permata" | "echannel";

export type FraudStatus = "accept" | "deny" | "challenge";

export type PaymentStatus =
	| "authorize"
	| "capture"
	| "settlement"
	| "deny"
	| "pending"
	| "cancel"
	| "refund"
	| "partial_refund"
	| "chargeback"
	| "partial_chargeback"
	| "expire"
	| "failure";

export type BankValue = "permata" | "bni" | "bri" | "bca";

export type GopayPaymentStatus = "pending" | "settlement" | "expire" | "deny";

export type StatusCode =
	| "200" // success
	| "201" // pending
	| "202" // denied
	| "300" // Move permanently. All current and future requests should be directed to the new URL permanently.
	| "400"
	| "401"
	| "402"
	| "403"
	| "404" // The requested resource/transaction is not found. Please check order_id or other details sent in the request.
	| "405"
	| "406" // Duplicate order ID. order_id has already been utilized previously.
	| "407" // Expired transaction.
	| "408"
	| "409"
	| "410"
	| "411"
	| "412"
	| "413"
	| "414"
	| "429" // API rate limit exceeded. The global rate limit is applied to Create Pay Account API and Charge API
	| "500" // Internal server error
	| "501" // The feature is not available.
	| "502" // Internal Server Error: Bank Connection Problem.
	| "503" // Bank/partner is experiencing connection issue.
	| "504" // Internal Server Error: Midtrans Fraud Detection System is unavailable.
	| "505"; // Failure to create requested VA number. Try again later.

export interface ChargeBaseResponse {
	status_code: StatusCode;
	status_message: string;
	transaction_id: string;
	order_id: string;
	gross_amount: string;
	transaction_time: string;
	expire_time: string;
}

export interface BankTransferChargeResponse extends ChargeBaseResponse {
	transaction_status: PaymentStatus;
	payment_type: "bank_transfer";
	fraud_status: FraudStatus;
	va_numbers: [
		{
			bank: BankValue;
			va_number: string;
		}
	];
	currency: "IDR";
	permata_va_number: string;
}

export interface EChannelChargeRespone extends ChargeBaseResponse {
	transaction_status: PaymentStatus;
	payment_type: "echannel";
	fraud_status: FraudStatus;
	bill_key: string;
	biller_code: string;
	currency: "IDR";
}

export type GopayActionsObject = [
	{
		name: "generate-qr-code";
		method: "GET";
		url: string;
	},
	{
		name: "deeplink-redirect";
		method: "GET";
		url: string;
	},
	{
		name: "get-status";
		method: "GET";
		url: string;
	},
	{
		name: "cancel";
		method: "POST";
		url: string;
		fields: string[];
	}
];

export interface GopayChargeResponse extends ChargeBaseResponse {
	transaction_status: GopayPaymentStatus;
	payment_type: "gopay";
	actions: GopayActionsObject;
	channel_response_code: number;
	channel_response_message: string;
	currency: "IDR";
}

export type ChargeResponse<T extends PaymentMethod> = T extends "gopay"
	? GopayChargeResponse
	: T extends "mandiri"
	? EChannelChargeRespone
	: BankTransferChargeResponse;

export type ChargeResponseType =
	| BankTransferChargeResponse
	| EChannelChargeRespone
	| GopayChargeResponse;

export interface TransactionDetailsType {
	chargeResponse: ChargeResponseType;
	shippingCost: number;
	discount: number;
	total: number;
	subtotal: number;
	customer_note: string;
	gift_note: string;
	user: User;
	userCartItems: CartItemDetails[];
	selectedAddress: Address;
	selectedShipping: CostItem;
	paymentMethod: PaymentMethod;
	selectedVoucher?: Voucher;
}

export type TransactionStatus = "pending" | "process" | "sent" | "success" | "cancel";

export interface TransactionTimelineItem {
	timeline_date: string;
	description: string;
}

export interface TransactionItem {
	product_id: number;
	quantity: number;
	price: string;
	product_size: number;
	title: string;
	slug: string;
	images: string[];
}

export interface Transaction {
	id: string;
	user_id: string;
	order_status: TransactionStatus;
	order_status_modified: string;
	gift_note: string;
	order_note: string;
	customer_note: string;
	voucher_code: string;
	discount_total: string;
	subtotal: string;
	total: string;
	created_at: string;
}

export interface TransactionPayment {
	transaction_id: string;
	payment_method: PaymentMethod;
	payment_status: PaymentStatus;
	payment_status_modified: string;
	payment_object: ChargeResponseType;
}

export interface TransactionShipping {
	transaction_id: string;
	shipping_cost: string;
	shipping_courier: string;
	shipping_service: string;
	shipping_tracking_code: string;
	shipping_etd: string;
}

export interface ClientPaymentDetailsItem {
	payment_method: PaymentMethod;
	payment_status: PaymentStatus;
	expire_time: string;
	bill_key?: string;
	biller_code?: string;
	va_number?: string;
	actions?: GopayActionsObject;
}

export interface ClientTransactionDetails extends Transaction {
	shipping_details: Address & TransactionShipping;
	item_details: TransactionItem[];
	payment_details: ClientPaymentDetailsItem;
	timeline: TransactionTimelineItem[];
}
