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
exports.updateTransaction = exports.getUserTransactions = exports.getSingleTransaction = exports.createTransaction = void 0;
// Config
const connectDB_1 = __importDefault(require("../../../config/connectDB"));
// Utils
const getLocalTime_1 = __importDefault(require("../../utils/getLocalTime"));
const utils_1 = require("../../utils");
const createTransaction = (transactionDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    const { chargeResponse, shippingCost, discount, total, subtotal, user, customer_note, gift_note, userCartItems, selectedAddress, selectedShipping, selectedVoucher, paymentMethod } = transactionDetails;
    try {
        yield client.query("BEGIN");
        // Create transaction record
        const transactionQuery = `INSERT INTO transactions(
      id, user_id, order_status, customer_note, gift_note, voucher_code, discount_total, subtotal, total
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;
        const transactionResult = yield client.query(transactionQuery, [
            chargeResponse.order_id,
            user.id,
            "pending",
            customer_note,
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
        const transactionShippingQuery = `INSERT INTO transactions_shipping(
      transaction_id, shipping_cost, shipping_courier, shipping_service, recipient_name, contact, address, province, province_id, city, city_id, subdistrict, subdistrict_id, postal_code, label, shipping_note, shipping_etd
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;
        const { courier, service, etd } = selectedShipping;
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
            shipping_note,
            etd
        ]);
        // Create transaction payment record
        const transactionTimelineQuery = `INSERT INTO transactions_timeline(
      transaction_id, timeline_object
    ) VALUES ($1, $2)
    `;
        yield client.query(transactionTimelineQuery, [
            transactionId,
            JSON.stringify([
                {
                    timeline_date: (0, getLocalTime_1.default)(),
                    description: "Pesanan telah dibuat"
                },
                {
                    timeline_date: (0, getLocalTime_1.default)(),
                    description: "Menunggu pembayaran"
                }
            ])
        ]);
        // Update voucher if using voucher
        if (selectedVoucher) {
            const voucherUsageQuery = `UPDATE voucher 
        SET current_usage = current_usage + 1 
      WHERE code = $1`;
            yield client.query(voucherUsageQuery, [selectedVoucher.code]);
        }
        // Remove user from voucher_dist if voucher_scope is user
        if (selectedVoucher && selectedVoucher.voucher_scope === "user") {
            const voucherDistRemoveQuery = `DELETE FROM voucher_dist 
      WHERE user_id = $1 AND voucher_code = $2`;
            yield client.query(voucherDistRemoveQuery, [user.id, selectedVoucher.code]);
        }
        // Clear user cart
        yield client.query("DELETE FROM cart WHERE user_id = $1", [user.id]);
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
const getSingleTransaction = (userId, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionQuery = `SELECT 
    t.id as id, t.user_id as user_id, t.order_status as order_status, 
    t.gift_note as gift_note, t.voucher_code as voucher_code, 
    t.customer_note as customer_note, t.created_at as created_at,
    ROUND(t.subtotal) AS subtotal, 
    ROUND(t.discount_total) AS discount_total,
    ROUND(t.total) AS total,
    to_json(ts) AS shipping_details,
    tt.timeline_object as timeline
  FROM transactions t
    JOIN transactions_shipping ts ON t.id = ts.transaction_id
    JOIN transactions_timeline tt ON t.id = tt.transaction_id
  WHERE user_id = $1 AND id = $2
    `;
    const transactionResult = yield connectDB_1.default.query(transactionQuery, [userId, transactionId]);
    if (transactionResult.rows.length === 0)
        throw new utils_1.ErrorObj.ClientError("Transaction not found!");
    const transactionPaymentQuery = `SELECT * FROM transactions_payment
  WHERE transaction_id = $1`;
    const transactionPaymentResult = yield connectDB_1.default.query(transactionPaymentQuery, [transactionId]);
    const transactionItemsQuery = `SELECT ti.*, products.*, ROUND(ti.price) AS price FROM transactions_item ti
  JOIN (
    SELECT p.id as product_id, p.title as title, p.slug as slug,
    (SELECT array_agg("url") AS images 
      FROM product_image pi 
      WHERE pi.product_id = p.id
    )
    FROM product p
  ) AS products 
  ON products.product_id = ti.product_id
  WHERE products.product_id = ti.product_id
  AND ti.transaction_id = $1`;
    const transactionItemsResult = yield connectDB_1.default.query(transactionItemsQuery, [transactionId]);
    return {
        transaction: transactionResult.rows[0],
        payment: transactionPaymentResult.rows[0],
        items: transactionItemsResult.rows
    };
});
exports.getSingleTransaction = getSingleTransaction;
const getUserTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsQuery = `
    SELECT 
    t.id as id, t.user_id as user_id, t.order_status as order_status, 
    t.created_at as created_at, ROUND(t.total) AS total, 
    (
      SELECT json_agg(json_build_object(
          'product_id', ti.product_id,
          'quantity', ti.quantity,
          'price', ROUND(ti.price),
          'product_size', ti.product_size,
          'title', products.title,
          'slug', products.slug,
          'images', products.images		
      ))
      FROM transactions_item ti
      JOIN (
        SELECT p.id as product_id, p.title as title, p.slug as slug,
          (
            SELECT array_agg("url") AS images 
            FROM product_image pi 
            WHERE pi.product_id = p.id
          )
          FROM product p
      ) AS products 
      ON products.product_id = ti.product_id
      WHERE products.product_id = ti.product_id
      AND ti.transaction_id = t.id
    ) as item_details
    FROM transactions t
    WHERE t.user_id = $1
    ORDER BY t.created_at DESC
  `;
    const transactionResult = yield connectDB_1.default.query(transactionsQuery, [userId]);
    return transactionResult.rows;
});
exports.getUserTransactions = getUserTransactions;
const updateTransaction = (orderId, orderStatus, paymentStatus, newTimelineItem, paymentObj) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB_1.default.pool.connect();
    try {
        yield client.query("BEGIN");
        // Update transactions
        const transactionsQuery = `UPDATE TABLE transactions
      SET order_status = $1, order_status_modified = $2
    WHERE id = $3
    `;
        yield client.query(transactionsQuery, [orderStatus, (0, getLocalTime_1.default)(), orderId]);
        // Update transactions_payment
        const tranasctionsPaymentQuery = `UPDATE TABLE transactions_payment
      SET payment_status = $1, payment_status_modified = $2, payment_object = $3
    WHERE transaction_id = $4`;
        yield client.query(tranasctionsPaymentQuery, [
            paymentStatus,
            (0, getLocalTime_1.default)(),
            paymentObj,
            orderId
        ]);
        // Update transactions_timeline
        const transactionsTimelineQuery = `UPDATE TABLE transactions_timeline
      SET timeline_object = timeline_object || $1::json
    WHERE transaction_id = $2`;
        yield client.query(transactionsTimelineQuery, [newTimelineItem, orderId]);
        yield client.query("COMMIT");
    }
    catch (error) {
        yield client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
});
exports.updateTransaction = updateTransaction;
