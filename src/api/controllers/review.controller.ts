// Dependencies
import { Request, Response } from "express";

// Services
import { reviewService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

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
