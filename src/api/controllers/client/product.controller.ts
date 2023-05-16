// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { productService } from "../../services/client";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
	const {
		brand: brandFilter = "",
		sortBy = "id",
		page = "",
		q = "",
		count = "",
		price: priceFilter = ""
	} = req.query;

	try {
		const { products, priceRange } = await productService.getAllProducts(
			page as string,
			q as string,
			sortBy as string,
			brandFilter as string,
			count as string,
			priceFilter as string
		);
		const { products: productsData, ...paginationData } = products;

		const minPrice = +priceRange.rows[0].min_price;
		const maxPrice = +priceRange.rows[0].max_price;

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { products: productsData.rows, priceRange: [minPrice, maxPrice] }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getSingleProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { productSlug } = req.params;
		const { productResult, recommendationsResult, productReviews } =
			await productService.getSingleProductBySlug(productSlug);

		res.status(200).json({
			status: "success",
			data: {
				product: {
					...productResult.rows[0],
					recommendations: recommendationsResult.rows,
					reviews: productReviews
				}
			}
		});
	} catch (error: unknown) {
		return next(error);
	}
};
