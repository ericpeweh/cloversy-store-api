// Dependencies
import dotenv from "dotenv";

// Types
import {
	Address,
	CartItemDetails,
	ChargeResponseType,
	ChargeResponse,
	CostItem,
	PaymentMethod,
	PaymentType,
	TransactionDetailsType,
	User,
	Voucher,
	ClientPaymentDetailsItem,
	AdminTransactionDetails,
	PaymentStatus,
	TransactionTimelineItem,
	TransactionStatus,
	FraudStatus,
	Transaction,
	UpdateTransactionDataArgs
} from "../interfaces";

// Utils
import { generateUniqueId, getLocalTime } from "../utils";

// Config
import coreAPI from "../../config/midtrans";
import { transactionRepo } from "../data";
import { transactionService } from ".";

dotenv.config();

export const getTransactions = async (
	userId: string,
	transactionStatus: string,
	searchQuery: string,
	sortBy: string,
	page: string,
	itemsLimit?: string
) => {
	const result = await transactionRepo.getTransactions(
		userId,
		transactionStatus,
		searchQuery,
		sortBy,
		page,
		itemsLimit
	);

	return result;
};

export const getSingleTransaction = async (transactionId: string) => {
	const { transaction, items, payment } = await transactionRepo.getSingleTransaction(transactionId);

	let paymentResult: ClientPaymentDetailsItem;

	if (payment.payment_method === "gopay") {
		const paymentObj = payment.payment_object as ChargeResponse<"gopay">;

		paymentResult = {
			payment_method: payment.payment_method,
			payment_status: payment.payment_status,
			expire_time: paymentObj.expire_time,
			payment_status_modified: payment.payment_status_modified,
			actions: paymentObj.actions
		};
	} else if (payment.payment_method === "mandiri") {
		const paymentObj = payment.payment_object as ChargeResponse<"mandiri">;

		paymentResult = {
			payment_method: payment.payment_method,
			payment_status: payment.payment_status,
			expire_time: paymentObj.expire_time,
			payment_status_modified: payment.payment_status_modified,
			bill_key: paymentObj.bill_key,
			biller_code: paymentObj.biller_code
		};
	} else {
		const paymentObj = payment.payment_object as ChargeResponse<"bni">;

		const isPermataBank = payment.payment_method === "permata";

		paymentResult = {
			payment_method: payment.payment_method,
			payment_status: payment.payment_status,
			expire_time: paymentObj.expire_time,
			payment_status_modified: payment.payment_status_modified,
			va_number: isPermataBank ? paymentObj.permata_va_number : paymentObj.va_numbers[0].va_number
		};
	}

	const result: AdminTransactionDetails = {
		...transaction,
		payment_details: paymentResult,
		item_details: items
	};

	return result;
};

export const updateTransaction = async (updateTransactionData: UpdateTransactionDataArgs) => {
	await transactionRepo.updateTransaction(updateTransactionData);

	const updatedTransaction = await transactionService.getSingleTransaction(
		updateTransactionData.transactionId
	);

	return updatedTransaction;
};

// export const cancelTransaction = async (
// 	transactionId: string,
// 	voucher: Voucher | undefined,
// 	transaction: Transaction
// ) => {
// 	const paymentObj = await coreAPI.transaction.cancel(transactionId);

// 	const orderStatus: TransactionStatus = "cancel";
// 	const paymentStatus: PaymentStatus = paymentObj.transaction_status || "cancel";

// 	await transactionRepo.updateTransaction(
// 		transactionId,
// 		orderStatus,
// 		paymentStatus,
// 		null,
// 		paymentObj,
// 		voucher,
// 		transaction
// 	);
// };
