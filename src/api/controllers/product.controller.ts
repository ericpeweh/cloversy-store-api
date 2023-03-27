// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { productService } from "../services";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
	const {
		status: productStatus = "",
		brand: brandFilter = "",
		sortBy = "id",
		page = "",
		q = ""
	} = req.query;

	try {
		const { products, ...paginationData } = await productService.getAllProducts(
			page as string,
			q as string,
			sortBy as string,
			productStatus as string,
			brandFilter as string
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { products: products.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getSingleProductById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { productId } = req.params;
		const {
			sales_analytic_year: salesAnalyticYear = "",
			visitor_analytic_year: visitorAnalyticYear = ""
		} = req.query;

		let salesYearFilter = salesAnalyticYear;
		if (!salesAnalyticYear) {
			salesYearFilter = new Date().getFullYear().toString();
		}

		let visitorYearFilter = visitorAnalyticYear;
		if (!visitorAnalyticYear) {
			visitorYearFilter = new Date().getFullYear().toString();
		}

		const result = await productService.getSingleProduct(
			productId,
			salesYearFilter as string,
			visitorYearFilter as string
		);

		res.status(200).json({
			status: "success",
			data: {
				product: result
			}
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			title,
			sku,
			price,
			status,
			category_id,
			brand_id,
			description,
			slug,
			tags = "",
			sizes = ""
		} = req.body;
		const images = req.files as Express.Multer.File[];

		const postQueryData = [title, sku, price, status, category_id, brand_id, description, slug];

		const result = await productService.createProduct(
			postQueryData,
			tags.split(","),
			sizes.split(","),
			images
		);

		res.status(200).json({
			status: "success",
			data: { newProduct: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { productId } = req.params;
		const {
			title,
			sku,
			price,
			status,
			category_id,
			brand_id,
			description,
			slug,
			tags = [],
			sizes = [],
			removedTags = [],
			removedSizes = [],
			removedImages = []
		} = req.body;
		const images = req.files as Express.Multer.File[];

		const updatedProductData = {
			title,
			sku,
			price,
			status,
			category_id,
			brand_id,
			description,
			slug
		};

		const result = await productService.updateProduct(
			{
				updatedProductData,
				productId,
				tags: tags.length > 0 ? tags.split(",") : [],
				sizes: sizes.length > 0 ? sizes.split(",") : [],
				removedTags: removedTags.length > 0 ? removedTags.split(",") : [],
				removedSizes: removedSizes.length > 0 ? removedSizes.split(",") : [],
				removedImages: removedImages.length > 0 ? removedImages.split(",") : []
			},
			images
		);

		res.status(200).json({
			status: "success",
			data: { updatedProduct: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { productId } = req.params;

		const result = await productService.deleteProduct(productId);

		res.status(200).json({
			status: "success",
			data: { deletedProductId: result.rows[0].id }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
