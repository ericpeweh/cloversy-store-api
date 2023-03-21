// Dependencies
import { Request, Response, NextFunction } from "express";

// Types
import { NotificationTypeFilter } from "../interfaces";

// Services
import { notificationService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { page = "", type = "", limit: itemsLimit = "10" } = req.query;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		const { notifications, notRead, ...paginationData } =
			await notificationService.getAllNotifications(
				type as NotificationTypeFilter,
				page as string,
				itemsLimit as string,
				userId
			);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { notifications, notRead }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const readNotification = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { notificationId } = req.params;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

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
	} catch (error: unknown) {
		return next(error);
	}
};
