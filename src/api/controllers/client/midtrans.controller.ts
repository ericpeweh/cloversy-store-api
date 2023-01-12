// Dependencies
import { Request, Response } from "express";
import dotenv from "dotenv";
import { sha512 } from "js-sha512";

dotenv.config();

// Utils
import { ErrorObj } from "../../utils";

// Types
import { Voucher, NotificationMessage } from "../../interfaces";

// Services
import { transactionService, voucherService } from "../../services/client";
import { notificationService } from "../../services";

export const handleNotifications = async (req: Request, res: Response) => {
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

		const transaction = await transactionService.getTransactionItem(order_id);
		const userTokens = await notificationService.getUserNotificationTokens([transaction.user_id]);
		const adminTokens = await notificationService.getAdminNotificationTokens();

		if (fraud_status == "challenge") {
			// Notify admin there is challenge transaction
			if (adminTokens) {
				const message: NotificationMessage = {
					title: "Pembayaran trannsaksi bermasalah",
					body: `Pesanan #${order_id} mengalami masalah saat melakukan pembayaran, menunggu konfirmasi admin.`,
					actionTitle: "Detail transaksi",
					actionLink: `http://localhost:3001/orders/${order_id}`
				};

				await notificationService.sendNotifications(message, adminTokens, {
					removeFailedTokens: true
				});
			}

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

			// Send notification to user and admin
			// Notify user when transaction expired
			if (transaction_status === "expire") {
				if (userTokens) {
					const message: NotificationMessage = {
						title: "Pesanan dibatalkan otomatis",
						body: `Pesanan #${order_id} telah dibatalkan otomatis oleh sistem dikarenakan pembayaran telah kadaluarsa.`,
						actionTitle: "Detail transaksi",
						actionLink: `http://localhost:3000/account/orders/${order_id}`
					};

					await notificationService.sendNotifications(message, userTokens, {
						removeFailedTokens: true
					});
				}
			}

			// Notify admin when there is a problem with transaction (deny)
			if (transaction_status === "deny" || fraud_status === "deny") {
				if (adminTokens) {
					const message: NotificationMessage = {
						title: "Pesanan dibatalkan karena bermasalah",
						body: `Pesanan #${order_id} telah dibatalkan karena bermasalah saat pembayaran.`,
						actionTitle: "Detail transaksi",
						actionLink: `http://localhost:3001/orders/${order_id}`
					};

					await notificationService.sendNotifications(message, adminTokens, {
						removeFailedTokens: true
					});
				}
			}
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

			// Notify user & admin on successfully paid transaction
			if (userTokens) {
				const message: NotificationMessage = {
					title: `Info transaksi #${order_id}`,
					body: `Pembayaran transaksi berhasil diterima, pesanan akan segera diproses.`,
					actionTitle: "Detail transaksi",
					actionLink: `http://localhost:3000/account/orders/${order_id}`
				};

				await notificationService.sendNotifications(message, userTokens, {
					removeFailedTokens: true
				});
			}

			if (adminTokens) {
				const message: NotificationMessage = {
					title: `Info transaksi #${order_id}`,
					body: `Pembayaran transaksi berhasil, transaksi siap diproses.`,
					actionTitle: "Detail transaksi",
					actionLink: `http://localhost:3001/orders/${order_id}`
				};

				await notificationService.sendNotifications(message, adminTokens, {
					removeFailedTokens: true
				});
			}
		}

		res.status(200).json({
			status: "success"
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
