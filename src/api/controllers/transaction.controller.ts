// Dependencies
import { Response, Request, NextFunction } from "express";

// Types
import {
	NotificationMessage,
	ShippingManifestItem,
	TransactionTimelineItem,
	Voucher
} from "../interfaces";

// Services
import { dataService, notificationService, transactionService, voucherService } from "../services";

// Utils
import { ErrorObj } from "../utils";

const _timelineSorter = (a: TransactionTimelineItem, b: TransactionTimelineItem) =>
	a.timeline_date > b.timeline_date ? -1 : a.timeline_date < b.timeline_date ? 1 : 0;

export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			userId = "",
			status: transactionStatus = "",
			q: searchQuery = "",
			sortBy = "created_at",
			page = "",
			limit: itemsLimit = "12"
		} = req.query;

		const { transactions, ...paginationData } = await transactionService.getTransactions(
			userId as string,
			transactionStatus as string,
			searchQuery as string,
			sortBy as string,
			page as string,
			itemsLimit as string
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { transactions: transactions.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getSingleTransaction = async (req: Request, res: Response, next: NextFunction) => {
	const { edit } = req.query;
	const { transactionId } = req.params;

	try {
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
			} catch (error) {
				// No catch code -- only to prevent throw error (could be implemented by logging)
			}
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
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateTransaction = async (req: Request, res: Response, next: NextFunction) => {
	const { transactionId } = req.params;
	const {
		orderNote = "",
		customerNote = "",
		giftNote = "",
		shippingTrackingCode = "",
		timelineObj
	} = req.body;

	try {
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
	} catch (error: unknown) {
		return next(error);
	}
};

export const changeTransactionStatus = async (req: Request, res: Response, next: NextFunction) => {
	const { transactionId } = req.params;
	const { orderStatus } = req.body;

	try {
		// Check transasction exist and its status
		const transaction = await transactionService.getTransactionItem(transactionId);

		if (!transaction) throw new ErrorObj.ClientError("Transaction not found!", 404);

		if (transaction.order_status === "cancel" || transaction.order_status === "success")
			throw new ErrorObj.ClientError(
				"Transaction with 'cancel' or 'success' status cannot be modified!"
			);

		if (transaction.order_status === orderStatus)
			throw new ErrorObj.ClientError("Failed to update: same order status is provided!");

		// Count in voucher if new status is 'cancel' to refund voucher back to user
		let voucher: Voucher | undefined = undefined;
		if (transaction.voucher_code && orderStatus === "cancel") {
			voucher = await voucherService.getVoucherItem(transaction.voucher_code);
		}

		const updatedTransactionData = await transactionService.changeTransactionStatus(
			transactionId,
			orderStatus,
			transaction,
			voucher
		);

		// Send notification
		const userTokens = await notificationService.getUserNotificationTokens([
			updatedTransactionData.user_id
		]);

		// Send notification to user if order is canceled
		if (userTokens) {
			if (updatedTransactionData.order_status === "cancel") {
				const message: NotificationMessage = {
					title: "Pesanan telah dibatalkan oleh admin",
					body: `Pesanan #${transaction.id} telah dibatalkan oleh admin, hubungi untuk informasi lebih lanjut.`,
					actionTitle: "Hubungi admin",
					actionLink: "http://localhost:3000/account/chat",
					deeplinkUrl: "account/livechat"
				};

				await notificationService.sendNotifications(message, userTokens, {
					removeFailedTokens: true
				});
			}

			if (updatedTransactionData.order_status === "sent") {
				const message: NotificationMessage = {
					title: "Pesanan telah dikirim",
					body: `Pesanan #${transaction.id} telah dikirim, nomor resi pengiriman (tracking) akan segera tersedia.`,
					actionTitle: "Detail transaksi",
					actionLink: `http://localhost:3000/account/orders/${transaction.id}`,
					deeplinkUrl: `orders/${transaction.id}/details`
				};

				await notificationService.sendNotifications(message, userTokens, {
					removeFailedTokens: true
				});
			}

			if (updatedTransactionData.order_status === "success") {
				const message: NotificationMessage = {
					title: "Pesanan telah selesai",
					body: `Pesanan #${transaction.id} telah selesai, yuk beri ulasan :)`,
					actionTitle: "Beri ulasan",
					actionLink: `http://localhost:3000/account/orders/${transaction.id}/review`,
					deeplinkUrl: `orders/${transaction.id}/review`
				};

				await notificationService.sendNotifications(message, userTokens, {
					removeFailedTokens: true
				});
			}
		}

		const { timeline: timelineData, ...transactionData } = updatedTransactionData;
		const timeline = timelineData.reverse();

		res.status(200).json({
			status: "success",
			data: { updatedTransaction: { ...transactionData, timeline } }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
