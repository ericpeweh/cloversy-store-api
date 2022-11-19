// Dependencies
import { Request, Response } from "express";

// Services
import { productsService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const result = await productsService.getAllProducts();

		res.status(200).json({
			status: "success",
			data: { products: result.rows }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSingleProduct = async (req: Request, res: Response) => {
	try {
		const { id: productId } = req.query;
		const { productSlug } = req.params;

		if (typeof productId !== "string") {
			throw new ErrorObj.ClientError("Query param 'id' has to be type of string");
		}

		const result = await productsService.getSingleProduct(productId, productSlug);

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

		const postQueryData = [title, sku, price, status, category_id, brand_id, description, slug];

		const result = await productsService.createProduct(postQueryData, tags, sizes);

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
			tags = [],
			sizes = [],
			deleteTagsId = [],
			deleteSizesId = []
		} = req.body;

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

		const result = await productsService.updateProduct({
			updatedProductData,
			productId,
			tags,
			sizes,
			deleteTagsId,
			deleteSizesId
		});

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

		const result = await productsService.deleteProduct(productId);

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
