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
exports.createTransaction = void 0;
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
// Utils
const getLocalTime_1 = __importDefault(require("../../utils/getLocalTime"));
const createTransaction = (transactionDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    const { chargeResponse, shippingCost, discount, total, subtotal, user, order_note, gift_note, userCartItems, selectedAddress, selectedShipping, selectedVoucher, paymentMethod } = transactionDetails;
    try {
        yield client.query("BEGIN");
        // Create transaction record
        const transactionQuery = `INSERT INTO transactions(
      id, user_id, order_status, order_note, gift_note, voucher_code, discount_total, subtotal, total
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;
        const transactionResult = yield client.query(transactionQuery, [
            chargeResponse.order_id,
            user.id,
            "pending",
            order_note,
            gift_note,
            (selectedVoucher === null || selectedVoucher === void 0 ? void 0 : selectedVoucher.code) || null,
            discount,
            subtotal,
            total
        ]);
        const transactionId = transactionResult.rows[0].id;
        // Create transaction item list records
        const transactionItemQuery = `INSERT INTO transactions_item(
      transaction_id, product_id, quantity, price, product_size
    ) VALUES ($1, $2, $3, $4, $5)
    `;
        for (const cartItem of userCartItems) {
            const { product_id, quantity, price, size } = cartItem;
            yield client.query(transactionItemQuery, [transactionId, product_id, quantity, price, size]);
        }
        // Create transaction payment record
        const transactionPaymentQuery = `INSERT INTO transactions_payment(
      transaction_id, payment_method, payment_status, payment_object
    ) VALUES ($1, $2, $3, $4)
    `;
        yield client.query(transactionPaymentQuery, [
            transactionId,
            paymentMethod,
            chargeResponse.transaction_status,
            chargeResponse
        ]);
        // Create transaction shipping record
        const transactionShippingQuery = `INSERT INTO transaction_shipping(
      transaction_id, shipping_cost, shipping_courier, shipping_service, recipient_name, contact, address, province, province_id, city, city_id, subditrict, subditrict_id, postal_code, label, shipping_note
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `;
        const { courier, service } = selectedShipping;
        const { address, recipient_name, contact, province, province_id, city, city_id, subdistrict, subdistrict_id, postal_code, label, shipping_note } = selectedAddress;
        yield client.query(transactionShippingQuery, [
            transactionId,
            shippingCost,
            courier,
            service,
            recipient_name,
            contact,
            address,
            province,
            province_id,
            city,
            city_id,
            subdistrict,
            subdistrict_id,
            postal_code,
            label,
            shipping_note
        ]);
        // Create transaction payment record
        const transactionTimelineQuery = `INSERT INTO transactions_timeline(
      transaction_id, timeline_object
    ) VALUES ($1, $2)
    `;
        yield client.query(transactionTimelineQuery, [
            transactionId,
            [
                {
                    timeline_date: (0, getLocalTime_1.default)(),
                    description: "Pesanan telah dibuat"
                }
            ]
        ]);
        yield client.query("COMMIT");
        return transactionId;
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
});
exports.createTransaction = createTransaction;
