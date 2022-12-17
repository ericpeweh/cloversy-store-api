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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
// Services
const client_1 = require("../../services/client");
const utils_1 = require("../../utils");
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { voucher_code, address_id, order_note = "", gift_note = "", shipping_courier, payment_method } = req.body;
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
                order_note,
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
        res.status(200).json({
            status: "success",
            data: { newTranactionId, vaNumber: chargeResponse.gross_amount }
        });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        });
    }
});
exports.createTransaction = createTransaction;
