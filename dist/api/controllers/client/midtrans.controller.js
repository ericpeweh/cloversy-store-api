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
exports.handleNotifications = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const js_sha512_1 = require("js-sha512");
dotenv_1.default.config();
// Services
const client_1 = require("../../services/client");
const utils_1 = require("../../utils");
const handleNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order_id, status_code, gross_amount, transaction_status, fraud_status, signature_key } = req.body;
    try {
        if (!order_id ||
            !status_code ||
            !gross_amount ||
            !transaction_status ||
            !fraud_status ||
            !signature_key) {
            throw new utils_1.ErrorObj.ClientError("Invalid request body!");
        }
        const key = (0, js_sha512_1.sha512)(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY);
        if (key !== signature_key)
            throw new utils_1.ErrorObj.ClientError("Invalid request signature!", 403);
        if (fraud_status == "challenge") {
            // Notify admin there is challenge transaction
            // <HERE>
            yield client_1.transactionService.challengeTransactionNotification(order_id, transaction_status, JSON.stringify(req.body));
        }
        if (fraud_status === "deny" ||
            transaction_status == "cancel" ||
            transaction_status == "deny" ||
            transaction_status == "expire") {
            yield client_1.transactionService.cancelTransactionNotification(order_id, transaction_status, JSON.stringify(req.body), fraud_status);
        }
        if (transaction_status == "settlement" &&
            (fraud_status === undefined || fraud_status === "accept")) {
            yield client_1.transactionService.successTransactionNotification(order_id, transaction_status, JSON.stringify(req.body));
        }
        res.status(200).json({
            status: "success"
        });
    }
    catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
});
exports.handleNotifications = handleNotifications;
