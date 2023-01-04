// Dependencies
import { Request, Response } from "express";

// Services
import { reviewService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getTransactionReviews = async (req: Request, res: Response) => {
	const { transactionId } = req.params;

	try {
		if (!transactionId || transactionId.length !== 10)
			throw new ErrorObj.ClientError("Invalid transaction id!");

		const reviews = await reviewService.getTransactionReviews(transactionId);

		res.status(200).json({
			status: "success",
			data: { reviews }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const getAllReviews = async (req: Request, res: Response) => {
	const {
		q: searchQuery = "",
		status: reviewStatus = "",
		sortBy = "id",
		page = "",
		limit: itemsLimit = "10"
	} = req.query;

	try {
		if (
			typeof searchQuery !== "string" ||
			typeof reviewStatus !== "string" ||
			typeof sortBy !== "string" ||
			typeof page !== "string" ||
			typeof itemsLimit !== "string"
		) {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (!["", "active", "disabled"].includes(reviewStatus)) {
			throw new ErrorObj.ClientError(`Query params 'status' of '${reviewStatus}' is not supported`);
		}

		if (!["id", "status", "rating", "created_at"].includes(sortBy))
			throw new ErrorObj.ClientError(`Query params 'sortBy' of '${sortBy}' is not supported`);

		const result = await reviewService.getAllReviews(
			searchQuery,
			reviewStatus,
			sortBy,
			page,
			itemsLimit
		);

		res.status(200).json({
			status: "success",
			data: result
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
