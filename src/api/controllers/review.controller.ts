// Dependencies
import { Request, Response } from "express";

// Services
import { reviewService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getSingleReview = async (req: Request, res: Response) => {
	const { reviewId } = req.params;

	try {
		if (!reviewId) throw new ErrorObj.ClientError("Invalid review id!");

		const review = await reviewService.getSingleReview(reviewId);

		res.status(200).json({
			status: "success",
			data: { review }
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
		limit: itemsLimit = "10",
		transactionId = ""
	} = req.query;

	try {
		if (
			typeof searchQuery !== "string" ||
			typeof reviewStatus !== "string" ||
			typeof sortBy !== "string" ||
			typeof page !== "string" ||
			typeof itemsLimit !== "string" ||
			typeof transactionId !== "string"
		) {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (transactionId && transactionId.length !== 10)
			throw new ErrorObj.ClientError("Invalid transaction id!");

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
			itemsLimit,
			transactionId
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

export const updateReview = async (req: Request, res: Response) => {
	const { reviewId } = req.params;
	const { rating, review, created_at, status } = req.body;

	try {
		if (!reviewId) throw new ErrorObj.ClientError("Invalid review id!");

		if (!rating || !review || !created_at || !status)
			throw new ErrorObj.ClientError("Invalid review data!");

		if (!["active", "disabled"].includes(status))
			throw new ErrorObj.ClientError("Invalid review status!");

		if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(+rating))
			throw new ErrorObj.ClientError("Rating must be between 1 to 10!");

		if (review.length > 200)
			throw new ErrorObj.ClientError("Review description length exceeded, max 200 characteres.");

		const reviewItem = await reviewService.getSingleReview(reviewId);

		if (!reviewItem) throw new ErrorObj.ClientError("Review not found!", 404);

		const updatedReview = await reviewService.updateReview(
			reviewId,
			rating,
			review,
			created_at,
			status
		);

		res.status(200).json({
			status: "success",
			data: { updatedReview }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
