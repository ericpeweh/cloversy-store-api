// Dependencies
import { Request, Response } from "express";

// Services
import { productService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

// Types

export const getAllProducts = async (req: Request, res: Response) => {
	const {
		brand: brandFilter = "",
		sortBy = "id",
		page = "",
		q = "",
		count = "",
		price: priceFilter = ""
	} = req.query;

	try {
		if (
			typeof sortBy !== "string" ||
			typeof q !== "string" ||
			typeof page !== "string" ||
			typeof brandFilter !== "string" ||
			typeof count !== "string" ||
			typeof priceFilter !== "string"
		) {
			throw new ErrorObj.ClientError(
				"Query param 'page', 'q', 'brand', 'count', 'price', and 'sortBy' has to be type of string"
			);
		}

		if (!["low-to-high", "high-to-low", "rating", "popularity", "id", ""].includes(sortBy)) {
			throw new ErrorObj.ClientError("Query param 'sortBy' is not supported");
		}

		const { products, priceRange } = await productService.getAllProducts(
			page,
			q,
			sortBy,
			brandFilter,
			count,
			priceFilter
		);
		const { products: productsData, ...paginationData } = products;

		const minPrice = +priceRange.rows[0].min_price;
		const maxPrice = +priceRange.rows[0].max_price;

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { products: productsData.rows, priceRange: [minPrice, maxPrice] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSingleProductBySlug = async (req: Request, res: Response) => {
	try {
		const { productSlug } = req.params;

		if (typeof productSlug !== "string") {
			throw new ErrorObj.ClientError("Query param 'id' has to be type of string");
		}

		const { productResult, recommendationsResult } = await productService.getSingleProductBySlug(
			productSlug
		);

		res.status(200).json({
			status: "success",
			data: { product: { ...productResult.rows[0], recommendations: recommendationsResult.rows } }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
