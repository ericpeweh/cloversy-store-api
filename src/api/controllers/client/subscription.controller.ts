// Dependencies
import { Request, Response } from "express";

// Services
import { subscriptionService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const subscribeToEmail = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		// Add email validation later with JOI

		if (!email) throw new ErrorObj.ClientError("Invalid email!");

		const subscribedEmail = await subscriptionService.subscribeToEmail(email);

		res.status(200).json({
			status: "success",
			data: { subscribedEmail }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const unsubscribeFromEmail = async (req: Request, res: Response) => {
	const { email } = req.body;

	try {
		// Add email validation later with JOI
		if (!email) throw new ErrorObj.ClientError("Invalid email!");

		const unsubscribedEmail = await subscriptionService.unsubscribeFromEmail(email);

		res.status(200).json({
			status: "success",
			data: { unsubscribedEmail }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
