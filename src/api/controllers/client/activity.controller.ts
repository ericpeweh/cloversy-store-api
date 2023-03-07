// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { productService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const getUserLastSeenProducts = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId) throw new ErrorObj.ClientError("Failed to identify user!", 403);

		const products = await productService.getUserLastSeenProducts(userId);

		res.status(200).json({
			status: "success",
			data: { products }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const trackUserLastSeenProduct = async (req: Request, res: Response, next: NextFunction) => {
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
	} catch (error: unknown) {
		return next(error);
	}
};
