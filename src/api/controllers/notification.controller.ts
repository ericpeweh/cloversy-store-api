// Dependencies
import { Request, Response } from "express";
import { NotificationTypeFilter } from "../interfaces";

// Services
import { brandService, notificationService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

export const getAllNotifications = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { page = "", type = "", limit: itemsLimit = "10" } = req.query;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		if (typeof type !== "string" || typeof page !== "string" || typeof itemsLimit !== "string") {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (!["transaction", "marketing", "message", "system", ""].includes(type)) {
			throw new ErrorObj.ClientError(`Query params 'type' of '${type}' is not supported`);
		}

		const { notifications, notRead, ...paginationData } =
			await notificationService.getAllNotifications(
				type as NotificationTypeFilter,
				page,
				itemsLimit,
				userId
			);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { notifications, notRead }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const readNotification = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { notificationId } = req.params;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);
		if (!notificationId) throw new ErrorObj.ClientError("Invalid notification id!");

		// Check notification exist
		await notificationService.getNotificationItem(notificationId);

		const { notRead, readNotificationId } = await notificationService.readNotification(
			notificationId,
			userId
		);

		res.status(200).json({
			status: "success",
			data: { notRead, readNotificationId }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
