// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { wishlistService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const getUserWishlist = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const result = await wishlistService.getWishlistProducts(userId);

		res.status(200).json({
			status: "success",
			data: { wishlist: result.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const addProductToWishlist = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { productId } = req.params;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const result = await wishlistService.addProductToWishlist(productId, userId);

		res.status(200).json({
			status: "success",
			data: { wishlist: result.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const deleteProductFromWishlist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = req.user?.id;
	const { productId } = req.params;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const result = await wishlistService.deleteProductFromWishlist(productId, userId);

		res.status(200).json({
			status: "success",
			data: { wishlist: result.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
export const emptyWishlist = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const result = await wishlistService.emptyWishlist(userId);

		res.status(200).json({
			status: "success",
			data: { wishlist: result.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
