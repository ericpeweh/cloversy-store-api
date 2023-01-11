// Dependencies
import { Response, Request } from "express";

// Types
import {
	ReviewRequestItem,
	ShippingManifestItem,
	TransactionTimelineItem,
	Voucher,
	NotificationMessage
} from "../../interfaces";
import { notificationService } from "../../services";

// Services
import {
	transactionService,
	cartService,
	addressService,
	voucherService,
	dataService,
	reviewService
} from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const getUserTransactions = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

		const transactions = await transactionService.getUserTransactions(userId);

		res.status(200).json({
			status: "success",
			data: { transactions }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSingleTransaction = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { transactionId } = req.params;

	try {
		if (!transactionId || transactionId.length !== 10)
			throw new ErrorObj.ClientError("Invalid transaction id!");

		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

		const transactionData = await transactionService.getSingleTransaction(userId, transactionId);
		const { timeline: timelineData, ...transaction } = transactionData;

		const timeline = timelineData.reverse();

		// Add waybill tracking if tracking code is provided
		const trackingCode = transaction.shipping_details.shipping_tracking_code;
		if (trackingCode) {
			const waybillManifest = await dataService.getShippingWaybill(
				trackingCode,
				transaction.shipping_details.shipping_courier
			);

			timeline.unshift(
				...waybillManifest
					.map((item: ShippingManifestItem) => ({
						timeline_date: `${item.manifest_date}${
							item.manifest_time.length === 5
								? `T${item.manifest_time}:00`
								: `T${item.manifest_time}`
						}`,
						description: `${item.city_name ? item.city_name + " - " : ""}${
							item.manifest_description
						}`
					}))
					// Sort manifest by date (DESCENDING)
					.sort((a, b) =>
						a.timeline_date > b.timeline_date ? -1 : a.timeline_date < b.timeline_date ? 1 : 0
					)
			);
		}

		res.status(200).json({
			status: "success",
			data: { transaction: { ...transaction, timeline } }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const createTransaction = async (req: Request, res: Response) => {
	const user = req.user;
	const {
		voucher_code,
		address_id,
		customer_note = "",
		gift_note = "",
		shipping_courier,
		payment_method
	} = req.body;

	try {
		if (!user) {
			throw new ErrorObj.ClientError("Failed to identify user!", 401);
		}

		if (!address_id || !shipping_courier || !payment_method) {
			throw new ErrorObj.ClientError("Invalid transaction data!");
		}

		if (!["gopay", "bni", "mandiri", "permata", "bri"].includes(payment_method)) {
			throw new ErrorObj.ClientError("Invalid payment method!");
		}

		if (voucher_code && voucher_code?.length !== 10)
			throw new ErrorObj.ClientError("Invalid voucher code!");

		const userCartItems = (await cartService.getDBCartItemsDetails(user.id)).rows;

		if (!userCartItems || userCartItems.length < 1) {
			throw new ErrorObj.ClientError("Failed to checkout: cart is empty!");
		}

		const selectedAddress = await addressService.getSingleUserAddress(user.id, address_id);

		let selectedVoucher;
		if (voucher_code) {
			selectedVoucher = await voucherService.getSingleVoucher(voucher_code, user.id);
		}

		const shippingInfo = shipping_courier.split(" ");

		if (shippingInfo.length !== 3) throw new ErrorObj.ClientError("Invalid shipping courier!");

		const shippingCourierName = shippingInfo[0];
		const shippingService = shippingInfo[1];

		const selectedShipping = (
			await dataService.getShippingCostBySubdistrict(selectedAddress.subdistrict_id)
		).find(item => item.courier === shippingCourierName && item.service === shippingService);

		if (!selectedShipping) throw new ErrorObj.ClientError("Shipping method not found!");

		const { chargeResponse, shippingCost, discount, total, subtotal } =
			await transactionService.chargeTransaction(
				user,
				userCartItems,
				selectedAddress,
				selectedShipping,
				payment_method,
				selectedVoucher
			);

		let newTranactionId;
		if (chargeResponse.status_code === "201") {
			newTranactionId = await transactionService.createTransaction({
				chargeResponse,
				shippingCost,
				discount,
				total,
				subtotal,
				user,
				customer_note,
				gift_note,
				userCartItems,
				selectedAddress,
				selectedShipping,
				selectedVoucher,
				paymentMethod: payment_method
			});
		} else {
			throw new ErrorObj.ClientError("Failed to create transaction!");
		}

		// Send notification to user and admin
		const userTokens = await notificationService.getUserNotificationTokens([user.id]);
		const adminTokens = await notificationService.getAdminNotificationTokens();

		if (userTokens) {
			const message: NotificationMessage = {
				title: "Berhasil membuat pesanan",
				body: `Pesanan #${newTranactionId} telah dibuat, menunggu pembayaran.`,
				actionTitle: "Bayar sekarang",
				actionLink: `http://localhost:3000/account/orders/${newTranactionId}/payment`
			};

			await notificationService.sendNotifications(message, userTokens);
		}

		if (adminTokens) {
			const message: NotificationMessage = {
				title: "Pesanan baru telah dibuat",
				body: `Pesanan #${newTranactionId} telah dibuat, menunggu pembayaran.`,
				actionTitle: "Detail transaksi",
				actionLink: `http://localhost:3001/orders/${newTranactionId}`
			};

			await notificationService.sendNotifications(message, adminTokens);
		}

		// Fetch transaction details
		const transaction = await transactionService.getSingleTransaction(
			user.id,
			newTranactionId.toString()
		);

		res.status(200).json({
			status: "success",
			data: { transaction }
		});
	} catch (error: any) {
		let errorMessage;
		console.log(error);

		if (error?.ApiResponse?.status_code === "500") {
			errorMessage =
				"Transaksi gagal: Sistem sedang bermasalah, mohon coba kembali setelah beberapa saat.";
		}

		res.status(error.statusCode || 500).json({
			status: "error",
			message: errorMessage || error.message
		});
	}
};

export const cancelTransaction = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { transactionId } = req.params;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

		if (!transactionId || transactionId.length !== 10)
			throw new ErrorObj.ClientError("Invalid transaction id!");

		// Check transaction exist and its status
		const transaction = await transactionService.getTransactionItem(transactionId);

		if (!transaction) throw new ErrorObj.ClientError("Transaction not found!", 404);

		if (transaction.order_status !== "pending")
			throw new ErrorObj.ClientError("Only transactions with pending status can be canceled");

		// Check user authorization to cancel transaction
		const isAuthorized = transaction.user_id === userId;

		if (!isAuthorized) throw new ErrorObj.ClientError("You're not authorized", 403);

		// Handle cancel transaction
		let voucher: Voucher | undefined = undefined;
		if (transaction.voucher_code) {
			voucher = await voucherService.getVoucherItem(transaction.voucher_code);
		}

		await transactionService.cancelTransaction(transactionId, voucher, transaction);

		// Notify user about canceled transaction
		const userTokens = await notificationService.getUserNotificationTokens([userId]);
		if (userTokens) {
			const message: NotificationMessage = {
				title: "Pesanan telah dibatalkan",
				body: `Pesanan #${transaction.id} telah anda dibatalkan.`,
				actionTitle: "Detail transaksi",
				actionLink: `http://localhost:3000/account/orders/${transaction.id}`
			};

			await notificationService.sendNotifications(message, userTokens);
		}

		res.status(200).json({
			status: "success",
			data: { transactionId }
		});
	} catch (error: any) {
		let errorMessage = "";
		if (error?.httpStatusCode === "412") {
			errorMessage = "Failed: transaction can't be canceled";
		}

		res.status(error.statusCode || 500).json({
			status: "error",
			message: errorMessage || error.message
		});
	}
};

export const reviewTransaction = async (req: Request, res: Response) => {
	const { transactionId } = req.params;
	const { reviews } = req.body;
	const userId = req.user?.id;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

		if (!transactionId || transactionId.length !== 10) {
			throw new ErrorObj.ClientError("Invalid transaction id!", 404);
		}

		if (!reviews || !(reviews instanceof Array))
			throw new ErrorObj.ClientError("Invalid reviews data!");

		const isValidReviews = reviews.every(
			review =>
				review.hasOwnProperty("rating") &&
				review.hasOwnProperty("review") &&
				[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(+review?.rating) &&
				review?.review.length >= 0 &&
				review?.review.length <= 200
		);

		if (!isValidReviews) throw new ErrorObj.ClientError("Invalid reviews data!");

		const transaction = await transactionService.getSingleTransaction(userId, transactionId);

		if (transaction.user_id !== userId)
			throw new ErrorObj.ClientError("You're not authorized to review this transaction!", 403);

		if (transaction.is_reviewed)
			throw new ErrorObj.ClientError("Unable to create review for already reviewed transaction!");

		if (
			transaction.order_status !== "success" ||
			transaction.payment_details.payment_status !== "settlement"
		) {
			throw new ErrorObj.ClientError(
				"Transaction need to be completed before able to create review."
			);
		}

		const trackSavedId: number[] = [];
		const savedReviewId = transaction.item_details.reduce((str, curr) => {
			if (trackSavedId.includes(curr.product_id)) {
				return str;
			} else {
				trackSavedId.push(curr.product_id);
				return str + curr.product_id.toString();
			}
		}, "");

		const reviewId = reviews.reduce((str, curr) => str + curr.product_id, "");

		if (savedReviewId !== reviewId)
			throw new ErrorObj.ClientError("Reviews data does not match transaction items!");

		await reviewService.createReviews(userId, transactionId, reviews as ReviewRequestItem[]);

		// Notify admin about new reviews
		const adminTokens = await notificationService.getAdminNotificationTokens();
		if (adminTokens) {
			const message: NotificationMessage = {
				title: `Review baru diterima #${transaction.id}`,
				body: `Konsumen telah meninggalkan ulasan baru untuk transaksi #${transaction.id}, silahkan cek review.`,
				actionTitle: "Lihat review",
				actionLink: `http://localhost:3001/orders/${transaction.id}`
			};

			await notificationService.sendNotifications(message, adminTokens);
		}

		res.status(200).json({
			status: "success",
			data: { transactionId }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
