// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { subscriptionService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const subscribeToEmail = async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;

	try {
		// Add email validation later with JOI

		if (!email) throw new ErrorObj.ClientError("Invalid email!");

		const subscribedEmail = await subscriptionService.subscribeToEmail(email);

		res.status(200).json({
			status: "success",
			data: { subscribedEmail }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const unsubscribeFromEmail = async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;

	try {
		// Add email validation later with JOI
		if (!email) throw new ErrorObj.ClientError("Invalid email!");

		const unsubscribedEmail = await subscriptionService.unsubscribeFromEmail(email);

		res.status(200).json({
			status: "success",
			data: { unsubscribedEmail }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const subscribeToPush = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { token } = req.body;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

		if (!token) throw new ErrorObj.ClientError("Invalid token!");

		const subscriptionId = await subscriptionService.subscribeToPush(token, userId.toString());

		res.status(200).json({
			status: "success",
			data: {
				subscriptionId
			}
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const unsubscribeFromPush = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { subscriptionId } = req.body;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!");

		if (!subscriptionId) throw new ErrorObj.ClientError("Invalid subscription id!");

		await subscriptionService.unsubscribeFromPush(+subscriptionId, userId.toString());

		res.status(200).json({
			status: "success",
			data: { unsubscribedId: subscriptionId }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
