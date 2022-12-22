"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.successTransactionNotification = exports.cancelTransactionNotification = exports.challengeTransactionNotification = exports.getSingleTransaction = exports.getUserTransactions = exports.createTransaction = exports.chargeTransaction = void 0;
// Dependencies
const dotenv_1 = __importDefault(require("dotenv"));
// Utils
const generateUniqueId_1 = __importDefault(require("../../utils/generateUniqueId"));
// Config
const midtrans_1 = __importDefault(require("../../../config/midtrans"));
const client_1 = require("../../data/client");
const getLocalTime_1 = __importDefault(require("../../utils/getLocalTime"));
dotenv_1.default.config();
const _decidePaymentType = (paymentMethod) => {
    let selectedPaymentMethod = "bank_transfer";
    if (paymentMethod === "gopay")
        selectedPaymentMethod = "gopay";
    if (paymentMethod === "mandiri")
        selectedPaymentMethod = "echannel";
    return selectedPaymentMethod;
};
const _calculateTransactionTotal = (userCartItems, selectedShipping, selectedVoucher) => {
    const subtotal = userCartItems.reduce((total, curr) => (total += curr.price * +curr.quantity), 0);
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
const chargeTransaction = (user, userCartItems, selectedAddress, selectedShipping, paymentMethod, selectedVoucher) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shippingCost, discount, total, subtotal } = _calculateTransactionTotal(userCartItems, selectedShipping, selectedVoucher);
        const paymentType = _decidePaymentType(paymentMethod);
        const orderId = (0, generateUniqueId_1.default)();
        const transactionParams = Object.assign(Object.assign(Object.assign({ payment_type: paymentType, transaction_details: {
                order_id: orderId,
                gross_amount: total
            } }, (paymentType === "bank_transfer" && { bank_transfer: { bank: paymentMethod } })), (paymentType === "echannel" && {
            echannel: {
                bill_info1: "Pembayaran:",
                bill_info2: `Cloversy.id No #${orderId})`
            }
        })), { 
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
            ], customer_details: {
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
            } });
        const chargeResponse = yield midtrans_1.default.charge(transactionParams);
        return { shippingCost, discount, total, subtotal, chargeResponse };
    }
    catch (error) {
        throw error;
    }
});
exports.chargeTransaction = chargeTransaction;
const createTransaction = (transactionDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const newTransactionId = yield client_1.transactionRepo.createTransaction(transactionDetails);
    return newTransactionId;
});
exports.createTransaction = createTransaction;
const getUserTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield client_1.transactionRepo.getUserTransactions(userId);
    return transactions;
});
exports.getUserTransactions = getUserTransactions;
const getSingleTransaction = (userId, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const { transaction, items, payment } = yield client_1.transactionRepo.getSingleTransaction(userId, transactionId);
    let paymentResult;
    if (payment.payment_method === "gopay") {
        const paymentObj = payment.payment_object;
        paymentResult = {
            payment_method: payment.payment_method,
            payment_status: payment.payment_status,
            expire_time: paymentObj.expire_time,
            actions: paymentObj.actions
        };
    }
    else if (payment.payment_method === "mandiri") {
        const paymentObj = payment.payment_object;
        paymentResult = {
            payment_method: payment.payment_method,
            payment_status: payment.payment_status,
            expire_time: paymentObj.expire_time,
            bill_key: paymentObj.bill_key,
            biller_code: paymentObj.biller_code
        };
    }
    else {
        const paymentObj = payment.payment_object;
        const isPermataBank = payment.payment_method === "permata";
        paymentResult = {
            payment_method: payment.payment_method,
            payment_status: payment.payment_status,
            expire_time: paymentObj.expire_time,
            va_number: isPermataBank ? paymentObj.permata_va_number : paymentObj.va_numbers[0].va_number
        };
    }
    const result = Object.assign(Object.assign({}, transaction), { payment_details: paymentResult, item_details: items });
    return result;
});
exports.getSingleTransaction = getSingleTransaction;
const challengeTransactionNotification = (orderId, transactionStatus, paymentObj) => __awaiter(void 0, void 0, void 0, function* () {
    const orderStatus = "pending";
    const paymentStatus = transactionStatus;
    const newTimelineItem = {
        timeline_date: (0, getLocalTime_1.default)(),
        description: "Pembayaran bermasalah, menunggu konfirmasi admin."
    };
    yield client_1.transactionRepo.updateTransaction(orderId, orderStatus, paymentStatus, newTimelineItem, paymentObj);
});
exports.challengeTransactionNotification = challengeTransactionNotification;
const cancelTransactionNotification = (orderId, transactionStatus, paymentObj, fraudStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const orderStatus = "cancel";
    const paymentStatus = transactionStatus;
    const timelineDescription = transactionStatus === "deny" || fraudStatus === "deny"
        ? "Pembayaran / transaksi ditolak, hubungi admin untuk info lebih lanjut"
        : transactionStatus === "cancel"
            ? "Transaksi dibatalkan oleh konsumen"
            : "Transaksi dibatalkan otomatis";
    const newTimelineItem = {
        timeline_date: (0, getLocalTime_1.default)(),
        description: timelineDescription
    };
    yield client_1.transactionRepo.updateTransaction(orderId, orderStatus, paymentStatus, newTimelineItem, paymentObj);
});
exports.cancelTransactionNotification = cancelTransactionNotification;
const successTransactionNotification = (orderId, transactionStatus, paymentObj) => __awaiter(void 0, void 0, void 0, function* () {
    const orderStatus = "process";
    const paymentStatus = transactionStatus;
    const newTimelineItem = [
        {
            timeline_date: (0, getLocalTime_1.default)(),
            description: "Berhasil melakukan pembayaran"
        },
        {
            timeline_date: (0, getLocalTime_1.default)(),
            description: "Pesanan akan segera diproses"
        }
    ];
    yield client_1.transactionRepo.updateTransaction(orderId, orderStatus, paymentStatus, newTimelineItem, paymentObj);
});
exports.successTransactionNotification = successTransactionNotification;
