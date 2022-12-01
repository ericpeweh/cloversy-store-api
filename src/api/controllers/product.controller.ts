// Dependencies
import { Request, Response } from "express";

// Services
import { productService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

export const getAllProducts = async (req: Request, res: Response) => {
	const {
		status: productStatus = "",
		brand: brandFilter = "",
		sortBy = "id",
		page = "",
		q = ""
	} = req.query;

	try {
		if (
			typeof sortBy !== "string" ||
			typeof q !== "string" ||
			typeof page !== "string" ||
			typeof productStatus !== "string" ||
			typeof brandFilter !== "string"
		) {
			throw new ErrorObj.ClientError(
				"Query param 'page', 'q', 'status', and 'sortBy' has to be type of string"
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
			brandFilter
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
			data: { product: result.rows[0] }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const createProduct = async (req: Request, res: Response) => {
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
			tags = [],
			sizes = []
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateProduct = async (req: Request, res: Response) => {
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
			tags = "",
			sizes = "",
			removedTags = "",
			removedSizes = "",
			removedImages = ""
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { productId } = req.params;

		const result = await productService.deleteProduct(productId);

		res.status(200).json({
			status: "success",
			data: { deletedProductId: result.rows[0].id }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
