// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { subscriptionService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

export const getPushSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
	const { page = "1", q: searchQuery = "" } = req.query;

	try {
		if (typeof searchQuery !== "string" || typeof page !== "string") {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		const { subscriptions, ...paginationData } = await subscriptionService.getPushSubscriptions(
			page,
			searchQuery
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
