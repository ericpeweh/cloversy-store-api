// Dependencies
import { Response, Request } from "express";

// Types
import { ShippingManifestItem, TransactionTimelineItem } from "../../interfaces";

// Services
import {
	transactionService,
	cartService,
	addressService,
	voucherService,
	dataService
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
