// Dependencies
import { Request, Response } from "express";

// Services
import { productService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

// Types

export const getAllProducts = async (req: Request, res: Response) => {
	const {
		status: productStatus = "",
		brand: brandFilter = "",
		sortBy = "id",
		page = "",
		q = "",
		count = ""
	} = req.query;

	try {
		if (
			typeof sortBy !== "string" ||
			typeof q !== "string" ||
			typeof page !== "string" ||
			typeof productStatus !== "string" ||
			typeof brandFilter !== "string" ||
			typeof count !== "string"
		) {
			throw new ErrorObj.ClientError(
				"Query param 'page', 'q', 'status', 'brand', 'count', and 'sortBy' has to be type of string"
			);
		}

		if (!["low-to-high", "high-to-low", "rating", "popularity", "id", ""].includes(sortBy)) {
			throw new ErrorObj.ClientError("Query param 'sortBy' is not supported");
		}

		const { products, ...paginationData } = await productService.getAllProducts(
			page,
			q,
			sortBy,
			productStatus,
			brandFilter,
			count
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { products: products.rows }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSingleProductById = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;

		if (typeof productId !== "string") {
			throw new ErrorObj.ClientError("Query param 'id' has to be type of string");
		}

		const result = await productService.getSingleProduct(productId);

		res.status(200).json({
			status: "success",
			data: { product: result }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
