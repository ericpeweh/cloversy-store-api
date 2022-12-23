// Dependencies
import { Request, Response } from "express";

// Services
import { productService } from "../../services/client";
import { ErrorObj } from "../../utils";

export const getUserLastSeenProducts = async (req: Request, res: Response) => {
	const userId = req.user?.id;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		const products = await productService.getUserLastSeenProducts(userId);

		res.status(200).json({
			status: "success",
			data: { products }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const trackUserLastSeenProduct = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { productId } = req.body;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		if (!productId) throw new ErrorObj.ClientError("Invalid product id!", 404);

		const lastSeenProductId = await productService.trackUserLastSeenProduct(productId, userId);

		res.status(200).json({
			status: "success",
			data: { lastSeenProductId }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
