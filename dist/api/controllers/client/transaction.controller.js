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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = exports.getSingleTransaction = exports.getUserTransactions = void 0;
// Services
const client_1 = require("../../services/client");
// Utils
const utils_1 = require("../../utils");
const getUserTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId)
            throw new utils_1.ErrorObj.ClientError("Failed to identify user!");
        const transactions = yield client_1.transactionService.getUserTransactions(userId);
        res.status(200).json({
            status: "success",
            data: { transactions }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getUserTransactions = getUserTransactions;
const getSingleTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    const { transactionId } = req.params;
    try {
        if (!transactionId || transactionId.length !== 10)
            throw new utils_1.ErrorObj.ClientError("Invalid transaction id!");
        if (!userId)
            throw new utils_1.ErrorObj.ClientError("Failed to identify user!");
        const transactionData = yield client_1.transactionService.getSingleTransaction(userId, transactionId);
        const { timeline: timelineData } = transactionData, transaction = __rest(transactionData, ["timeline"]);
        const timeline = timelineData.reverse();
        // Add waybill tracking if tracking code is provided
        const trackingCode = transaction.shipping_details.shipping_tracking_code;
        if (trackingCode) {
            const waybillManifest = yield client_1.dataService.getShippingWaybill(trackingCode, transaction.shipping_details.shipping_courier);
            timeline.unshift(...waybillManifest
                .map((item) => ({
                timeline_date: `${item.manifest_date}${item.manifest_time.length === 5
                    ? `T${item.manifest_time}:00`
                    : `T${item.manifest_time}`}`,
                description: `${item.city_name ? item.city_name + " - " : ""}${item.manifest_description}`
            }))
                // Sort manifest by date (DESCENDING)
                .sort((a, b) => a.timeline_date > b.timeline_date ? -1 : a.timeline_date < b.timeline_date ? 1 : 0));
        }
        res.status(200).json({
            status: "success",
            data: { transaction: Object.assign(Object.assign({}, transaction), { timeline }) }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.getSingleTransaction = getSingleTransaction;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const user = req.user;
    const { voucher_code, address_id, customer_note = "", gift_note = "", shipping_courier, payment_method } = req.body;
    try {
        if (!user) {
            throw new utils_1.ErrorObj.ClientError("Failed to identify user!", 401);
        }
        if (!address_id || !shipping_courier || !payment_method) {
            throw new utils_1.ErrorObj.ClientError("Invalid transaction data!");
        }
        if (!["gopay", "bni", "mandiri", "permata", "bri"].includes(payment_method)) {
            throw new utils_1.ErrorObj.ClientError("Invalid payment method!");
        }
        if (voucher_code && (voucher_code === null || voucher_code === void 0 ? void 0 : voucher_code.length) !== 10)
            throw new utils_1.ErrorObj.ClientError("Invalid voucher code!");
        const userCartItems = (yield client_1.cartService.getDBCartItemsDetails(user.id)).rows;
        if (!userCartItems || userCartItems.length < 1) {
            throw new utils_1.ErrorObj.ClientError("Failed to checkout: cart is empty!");
        }
        const selectedAddress = yield client_1.addressService.getSingleUserAddress(user.id, address_id);
        let selectedVoucher;
        if (voucher_code) {
            selectedVoucher = yield client_1.voucherService.getSingleVoucher(voucher_code, user.id);
        }
        const shippingInfo = shipping_courier.split(" ");
        if (shippingInfo.length !== 3)
            throw new utils_1.ErrorObj.ClientError("Invalid shipping courier!");
        const shippingCourierName = shippingInfo[0];
        const shippingService = shippingInfo[1];
        const selectedShipping = (yield client_1.dataService.getShippingCostBySubdistrict(selectedAddress.subdistrict_id)).find(item => item.courier === shippingCourierName && item.service === shippingService);
        if (!selectedShipping)
            throw new utils_1.ErrorObj.ClientError("Shipping method not found!");
        const { chargeResponse, shippingCost, discount, total, subtotal } = yield client_1.transactionService.chargeTransaction(user, userCartItems, selectedAddress, selectedShipping, payment_method, selectedVoucher);
        let newTranactionId;
        if (chargeResponse.status_code === "201") {
            newTranactionId = yield client_1.transactionService.createTransaction({
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
        }
        else {
            throw new utils_1.ErrorObj.ClientError("Failed to create transaction!");
        }
        // Fetch transaction details
        const transaction = yield client_1.transactionService.getSingleTransaction(user.id, newTranactionId.toString());
        res.status(200).json({
            status: "success",
            data: { transaction }
        });
    }
    catch (error) {
        let errorMessage;
        console.log(error);
        if (((_c = error === null || error === void 0 ? void 0 : error.ApiResponse) === null || _c === void 0 ? void 0 : _c.status_code) === "500") {
            errorMessage =
                "Transaksi gagal: Sistem sedang bermasalah, mohon coba kembali setelah beberapa saat.";
        }
        res.status(error.statusCode || 500).json({
            status: "error",
            message: errorMessage || error.message
        });
    }
});
exports.createTransaction = createTransaction;
