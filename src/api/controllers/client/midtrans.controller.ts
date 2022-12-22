// Dependencies
import { Request, Response } from "express";
import dotenv from "dotenv";
import { sha512 } from "js-sha512";

dotenv.config();

// Services
import { transactionService, voucherService } from "../../services/client";
import { ErrorObj } from "../../utils";
import { Voucher } from "../../interfaces";

export const handleNotifications = async (req: Request, res: Response) => {
	console.log("TRIGGERED NOTIFICATIONS!");
	console.log("NOTIFICATIONS BODY: ", req.body);

	const { order_id, status_code, gross_amount, transaction_status, fraud_status, signature_key } =
		req.body;

	try {
		if (
			!order_id ||
			!status_code ||
			!gross_amount ||
			!transaction_status ||
			!fraud_status ||
			!signature_key
		) {
			throw new ErrorObj.ClientError("Invalid request body!");
		}

		const key = sha512(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY);

		if (key !== signature_key) throw new ErrorObj.ClientError("Invalid request signature!", 403);

		if (fraud_status == "challenge") {
			// Notify admin there is challenge transaction
			// <HERE>
			await transactionService.challengeTransactionNotification(
				order_id,
				transaction_status,
				JSON.stringify(req.body)
			);

			return res.status(200).json({
				status: "success"
			});
		}

		if (
			fraud_status === "deny" ||
			transaction_status == "cancel" ||
			transaction_status == "deny" ||
			transaction_status == "expire"
		) {
			const transaction = await transactionService.getTransactionItem(order_id);

			let voucher: Voucher | undefined = undefined;
			if (transaction.voucher_code) {
				voucher = await voucherService.getVoucherItem(transaction.voucher_code);
			}

			await transactionService.cancelTransactionNotification(
				order_id,
				transaction_status,
				JSON.stringify(req.body),
				fraud_status,
				voucher,
				transaction
			);
		}

		if (
			transaction_status == "settlement" &&
			(fraud_status === undefined || fraud_status === "accept")
		) {
			await transactionService.successTransactionNotification(
				order_id,
				transaction_status,
				JSON.stringify(req.body)
			);
		}

		res.status(200).json({
			status: "success"
		});
	} catch (error: any) {
		console.log(error);

		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
