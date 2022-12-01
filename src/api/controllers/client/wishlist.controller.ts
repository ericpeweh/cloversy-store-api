// Dependencies
import { Request, Response } from "express";

// Types
import { Address } from "../../interfaces";

// Services
import { wishlistService } from "../../services/client";
import { ErrorObj } from "../../utils";

// Types

export const getUserWishlist = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const addProductToWishlist = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const deleteProductFromWishlist = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
export const emptyWishlist = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
