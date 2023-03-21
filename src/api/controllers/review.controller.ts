// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { reviewService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getSingleReview = async (req: Request, res: Response, next: NextFunction) => {
	const { reviewId } = req.params;

	try {
		const review = await reviewService.getSingleReview(reviewId);

		res.status(200).json({
			status: "success",
			data: { review }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
	const {
		q: searchQuery = "",
		status: reviewStatus = "",
		sortBy = "id",
		page = "",
		limit: itemsLimit = "10",
		transactionId = ""
	} = req.query;

	try {
		const result = await reviewService.getAllReviews(
			searchQuery as string,
			reviewStatus as string,
			sortBy as string,
			page as string,
			itemsLimit as string,
			transactionId as string
		);

		res.status(200).json({
			status: "success",
			data: result
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
	const { reviewId } = req.params;
	const { rating, review, created_at, status } = req.body;

	try {
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
	} catch (error: unknown) {
		return next(error);
	}
};
