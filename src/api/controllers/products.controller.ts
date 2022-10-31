// Dependencies
import { Request, Response } from "express";

// Services
import { productsService } from "../services";

// Types
import { ProductType } from "../interfaces";

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

export const createProduct = async (req: Request, res: Response) => {
	try {
		const { title, sku, price, status, category_id, brand_id, description, slug } = req.body;

		const postQueryData = [title, sku, price, status, category_id, brand_id, description, slug];

		const result = await productsService.createProduct(postQueryData);

		res.status(200).json({
			status: "success",
			data: { newProduct: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
