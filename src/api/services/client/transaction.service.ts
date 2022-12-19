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
	ClientTransactionDetails
} from "../../interfaces";

// Utils
import generateUniqueId from "../../utils/generateUniqueId";

// Config
import coreAPI from "../../../config/midtrans";
import { transactionRepo } from "../../data/client";

dotenv.config();

const _decidePaymentType = (paymentMethod: PaymentMethod) => {
	let selectedPaymentMethod: PaymentType = "bank_transfer";

	if (paymentMethod === "gopay") selectedPaymentMethod = "gopay";
	if (paymentMethod === "mandiri") selectedPaymentMethod = "echannel";

	return selectedPaymentMethod;
};

const _calculateTransactionTotal = (
	userCartItems: CartItemDetails[],
	selectedShipping: CostItem,
	selectedVoucher?: Voucher
) => {
	const subtotal = userCartItems.reduce(
		(total: number, curr: CartItemDetails) => (total += curr.price * +curr.quantity),
		0
	);

	let discount = 0;
	if (selectedVoucher) {
		discount =
			selectedVoucher.discount_type === "value"
				? selectedVoucher.discount
				: subtotal * (selectedVoucher.discount / 100);
	}

	const shippingCost = +selectedShipping.value;

	return { subtotal, shippingCost, discount, total: subtotal + shippingCost - discount };
};

export const chargeTransaction = async (
	user: User,
	userCartItems: CartItemDetails[],
	selectedAddress: Address,
	selectedShipping: CostItem,
	paymentMethod: PaymentMethod,
	selectedVoucher?: Voucher
) => {
	try {
		const { shippingCost, discount, total, subtotal } = _calculateTransactionTotal(
			userCartItems,
			selectedShipping,
			selectedVoucher
		);
		const paymentType = _decidePaymentType(paymentMethod);

		const orderId = generateUniqueId();

		const transactionParams = {
			payment_type: paymentType,
			transaction_details: {
				order_id: orderId,
				gross_amount: total
			},
			...(paymentType === "bank_transfer" && { bank_transfer: { bank: paymentMethod } }),
			...(paymentType === "echannel" && {
				echannel: {
					bill_info1: "Pembayaran:",
					bill_info2: `Cloversy.id No #${orderId})`
				}
			}),
			// FOR MOBILE APP
			// ...(paymentType === "gopay" && {
			// 	gopay: {
			//     enable_callback: true,
			//     callback_url: "someapps://callback"
			//   }
			// }),
			item_details: [
				...userCartItems.map(cartItem => ({
					id: `${+cartItem.product_id} ${cartItem.size}`,
					price: +cartItem.price,
					quantity: +cartItem.quantity,
					name: `${cartItem.title} - EU ${cartItem.size}`,
					brand: cartItem.brand_id + "",
					category: cartItem.category_id + ""
				})),
				...(selectedVoucher
					? [
							{
								name: "Discount",
								price: -discount,
								quantity: 1,
								id: "D01"
							}
					  ]
					: []),
				{
					name: "Shipping",
					price: shippingCost,
					quantity: 1,
					id: "S01"
				}
			],
			customer_details: {
				first_name: user.full_name,
				email: user.email,
				phone: user.contact,
				shipping_address: {
					first_name: selectedAddress.recipient_name,
					phone: selectedAddress.contact,
					address: selectedAddress.address,
					city: selectedAddress.city,
					postal_code: selectedAddress.postal_code,
					country_code: "IDN"
				}
			}
		};

		const chargeResponse: ChargeResponseType = await coreAPI.charge(transactionParams);

		return { shippingCost, discount, total, subtotal, chargeResponse };
	} catch (error: any) {
		throw error;
	}
};

export const createTransaction = async (
	transactionDetails: Omit<TransactionDetailsType, "order_note">
) => {
	const newTransactionId = await transactionRepo.createTransaction(transactionDetails);

	return newTransactionId;
};

export const getUserTransactions = async (userId: string) => {
	const transactions = await transactionRepo.getUserTransactions(userId);

	return transactions;
};

export const getSingleTransaction = async (userId: string, transactionId: string) => {
	const { transaction, items, payment } = await transactionRepo.getSingleTransaction(
		userId,
		transactionId
	);

	let paymentResult: ClientPaymentDetailsItem;

	if (payment.payment_method === "gopay") {
		const paymentObj = payment.payment_object as ChargeResponse<"gopay">;

		paymentResult = {
			payment_method: payment.payment_method,
			payment_status: payment.payment_status,
			expire_time: paymentObj.expire_time,
			actions: paymentObj.actions
		};
	} else if (payment.payment_method === "mandiri") {
		const paymentObj = payment.payment_object as ChargeResponse<"mandiri">;

		paymentResult = {
			payment_method: payment.payment_method,
			payment_status: payment.payment_status,
			expire_time: paymentObj.expire_time,
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
			va_number: isPermataBank ? paymentObj.permata_va_number : paymentObj.va_numbers[0].va_number
		};
	}

	const result: ClientTransactionDetails = {
		...transaction,
		payment_details: paymentResult,
		item_details: items
	};

	return result;
};
