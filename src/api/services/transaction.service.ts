// Dependencies
import dotenv from "dotenv";

// Types
import {
	ChargeResponse,
	Voucher,
	ClientPaymentDetailsItem,
	AdminTransactionDetails,
	TransactionTimelineItem,
	TransactionStatus,
	Transaction,
	UpdateTransactionDataArgs
} from "../interfaces";

// Utils
import { getLocalTime } from "../utils";

// Config
import { transactionRepo } from "../data";
import { transactionService } from ".";
import coreAPI from "../../config/midtrans";

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
			actions: paymentObj?.actions
		};
	} else if (payment.payment_method === "mandiri") {
		const paymentObj = payment.payment_object as ChargeResponse<"mandiri">;

		paymentResult = {
			payment_method: payment.payment_method,
			payment_status: payment.payment_status,
			expire_time: paymentObj.expire_time,
			payment_status_modified: payment.payment_status_modified,
			bill_key: paymentObj?.bill_key,
			biller_code: paymentObj?.biller_code
		};
	} else {
		const paymentObj = payment.payment_object as ChargeResponse<"bni">;

		const isPermataBank = payment.payment_method === "permata";

		paymentResult = {
			payment_method: payment.payment_method,
			payment_status: payment.payment_status,
			expire_time: paymentObj.expire_time,
			payment_status_modified: payment.payment_status_modified,
			va_number:
				payment.payment_status === "cancel"
					? ""
					: isPermataBank
					? paymentObj?.permata_va_number
					: paymentObj?.va_numbers[0]?.va_number
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

export const getTransactionItem = async (transactionId: string) => {
	const transaction = await transactionRepo.getTransactionItem(transactionId);

	return transaction;
};

export const changeTransactionStatus = async (
	transactionId: string,
	orderStatus: TransactionStatus,
	transaction: Transaction,
	voucher: Voucher | undefined
) => {
	let timelineDesc = "";
	let paymentStatus: "pending" | "settlement" | "cancel" = "pending";
	let paymentObj = null;

	if (orderStatus === "pending") {
		timelineDesc = "Status transaksi diubah menjadi PENDING [ADMIN]";
	} else if (orderStatus === "process") {
		timelineDesc = "Status transaksi diubah menjadi PROCESS [ADMIN]";
		paymentStatus = "settlement";
	} else if (orderStatus === "sent") {
		timelineDesc = "Produk telah dikirim, no resi pengiriman akan segera tersedia [ADMIN]";
		paymentStatus = "settlement";
	} else if (orderStatus === "success") {
		timelineDesc = "Transaksi telah selesai, akses ulasan diberikan [ADMIN]";
		paymentStatus = "settlement";
	} else if (orderStatus === "cancel") {
		// Try to cancel midtrans transaction
		try {
			paymentObj = await coreAPI.transaction.cancel(transactionId);

			paymentStatus = paymentObj.transaction_status || "cancel";
		} catch (error) {
			paymentStatus = "cancel";
		}

		timelineDesc = "Transaksi dibatalkan oleh [ADMIN]";
	}

	const newTimelineItem: TransactionTimelineItem = {
		timeline_date: getLocalTime(),
		description: timelineDesc
	};

	await transactionRepo.changeTransactionStatus(
		transactionId,
		orderStatus,
		paymentStatus,
		newTimelineItem,
		paymentObj,
		voucher,
		transaction
	);

	const updatedTransaction = await transactionService.getSingleTransaction(transactionId);

	return updatedTransaction;
};
