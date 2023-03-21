// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { subscriptionService } from "../services";

export const getPushSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
	const { page = "1", q: searchQuery = "" } = req.query;

	try {
		const { subscriptions, ...paginationData } = await subscriptionService.getPushSubscriptions(
			page as string,
			searchQuery as string
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { subscriptions: subscriptions.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
