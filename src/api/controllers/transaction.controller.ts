// Dependencies
import { Response, Request } from "express";

// Types
import { ShippingManifestItem, TransactionTimelineItem } from "../interfaces";

// Services
import { dataService, transactionService } from "../services";

// Utils
import { ErrorObj } from "../utils";

const _timelineSorter = (a: TransactionTimelineItem, b: TransactionTimelineItem) =>
	a.timeline_date > b.timeline_date ? -1 : a.timeline_date < b.timeline_date ? 1 : 0;

export const getTransactions = async (req: Request, res: Response) => {
	try {
		const {
			userId = "",
			status: transactionStatus = "",
			q: searchQuery = "",
			sortBy = "created_at",
			page = "",
			limit: itemsLimit = "12"
		} = req.query;

		if (
			typeof userId !== "string" ||
			typeof transactionStatus !== "string" ||
			typeof searchQuery !== "string" ||
			typeof sortBy !== "string" ||
			typeof page !== "string" ||
			typeof itemsLimit !== "string"
		) {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (!["pending", "process", "sent", "success", "cancel", ""].includes(transactionStatus)) {
			throw new ErrorObj.ClientError(
				`Query params 'status' of '${transactionStatus}' is not supported`
			);
		}

		if (!["low-to-high", "high-to-low", "order_status", "created_at", "id", ""].includes(sortBy)) {
			throw new ErrorObj.ClientError(`Query params 'sortBy' of '${sortBy}' is not supported`);
		}

		const { transactions, ...paginationData } = await transactionService.getTransactions(
			userId,
			transactionStatus,
			searchQuery,
			sortBy,
			page,
			itemsLimit
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { transactions: transactions.rows }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSingleTransaction = async (req: Request, res: Response) => {
	const { edit } = req.query;
	const { transactionId } = req.params;

	try {
		if (!transactionId || transactionId.length !== 10)
			throw new ErrorObj.ClientError("Invalid transaction id!");

		const transactionData = await transactionService.getSingleTransaction(transactionId);
		const { timeline: timelineData, ...transaction } = transactionData;

		const timeline = timelineData;

		// Add waybill tracking if tracking code is provided
		let waybillTimeline: TransactionTimelineItem[] = [];
		const trackingCode = transaction.shipping_details.shipping_tracking_code;
		if (trackingCode) {
			try {
				const waybillManifest = await dataService.getShippingWaybill(
					trackingCode,
					transaction.shipping_details.shipping_courier
				);

				const waybillManifestTimeline = waybillManifest.map((item: ShippingManifestItem) => ({
					timeline_date: `${item.manifest_date}${
						item.manifest_time.length === 5 ? `T${item.manifest_time}:00` : `T${item.manifest_time}`
					}`,
					description: `${item.city_name ? item.city_name + " - " : ""}${item.manifest_description}`
				}));

				if (edit === "1") {
					const sortedWaybillManifestTimeline = waybillManifestTimeline
						.sort(_timelineSorter)
						.map(item => ({ ...item, waybill: true }));

					waybillTimeline = sortedWaybillManifestTimeline;
				} else {
					timeline.unshift(...waybillManifestTimeline);
				}
			} catch (error) {}
		}

		// Sort manifest by date (DESCENDING)
		const sortedTimeline = timeline.sort(_timelineSorter);

		res.status(200).json({
			status: "success",
			data: {
				transaction: {
					...transaction,
					timeline: sortedTimeline,
					...(edit === "1" && { waybillTimeline: waybillTimeline })
				}
			}
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateTransaction = async (req: Request, res: Response) => {
	const { transactionId } = req.params;
	const { orderNote, customerNote, giftNote, shippingTrackingCode, timelineObj } = req.body;

	try {
		if (!transactionId || transactionId.length !== 10)
			throw new ErrorObj.ClientError("Invalid transaction id!");

		const updatedTransactionData = {
			order_note: orderNote,
			customer_note: customerNote,
			gift_note: giftNote
		};

		const updateTransactionData = await transactionService.updateTransaction({
			transactionId,
			updatedTransactionData,
			timelineObj,
			shippingTrackingCode
		});

		const { timeline: timelineData, ...transaction } = updateTransactionData;
		const timeline = timelineData.reverse();

		res.status(200).json({
			status: "success",
			data: { updatedTransaction: { ...transaction, timeline } }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

// export const getUserTransactions = async (req: Request, res: Response) => {
// 	const userId = req.user?.id;

// 	try {
// 		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

// 		const transactions = await transactionService.getUserTransactions(userId);

// 		res.status(200).json({
// 			status: "success",
// 			data: { transactions }
// 		});
// 	} catch (error: any) {
// 		res.status(error.statusCode || 500).json({
// 			status: "error",
// 			message: error.message
// 		});
// 	}
// };

// export const cancelTransaction = async (req: Request, res: Response) => {
// 	const userId = req.user?.id;
// 	const { transactionId } = req.params;

// 	try {
// 		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

// 		if (!transactionId || transactionId.length !== 10)
// 			throw new ErrorObj.ClientError("Invalid transaction id!");

// 		// Check transaction exist and its status
// 		const transaction = await transactionService.getTransactionItem(transactionId);

// 		if (!transaction) throw new ErrorObj.ClientError("Transaction not found!", 404);

// 		if (transaction.order_status !== "pending")
// 			throw new ErrorObj.ClientError("Only transactions with pending status can be canceled");

// 		// Check user authorization to cancel transaction
// 		const isAuthorized = transaction.user_id === userId;

// 		if (!isAuthorized) throw new ErrorObj.ClientError("You're not authorized", 403);

// 		// Handle cancel transaction
// 		let voucher: Voucher | undefined = undefined;
// 		if (transaction.voucher_code) {
// 			voucher = await voucherService.getVoucherItem(transaction.voucher_code);
// 		}

// 		await transactionService.cancelTransaction(transactionId, voucher, transaction);

// 		res.status(200).json({
// 			status: "success",
// 			data: { transactionId }
// 		});
// 	} catch (error: any) {
// 		let errorMessage = "";
// 		if (error?.httpStatusCode === "412") {
// 			errorMessage = "Failed: transaction can't be canceled";
// 		}

// 		res.status(error.statusCode || 500).json({
// 			status: "error",
// 			message: errorMessage || error.message
// 		});
// 	}
// };
