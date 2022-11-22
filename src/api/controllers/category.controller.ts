// Dependencies
import { Request, Response } from "express";

// Services
import { categoryService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

export const getAllCategories = async (req: Request, res: Response) => {
	const { page = "", q = "", sortBy = "id" } = req.query;

	try {
		if (typeof sortBy !== "string" || typeof q !== "string" || typeof page !== "string") {
			throw new ErrorObj.ClientError(
				"Query param 'page', 'q', and 'sortBy' has to be type of string"
			);
		}

		if (!["product_amount", "a-z", "z-a", "id", ""].includes(sortBy)) {
			throw new ErrorObj.ClientError("Query param 'sortBy' is not supported");
		}

		const { categories, ...paginationData } = await categoryService.getAllCategories(
			page,
			q,
			sortBy
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { categories: categories.rows }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const createCategory = async (req: Request, res: Response) => {
	try {
		const { name, description, identifier } = req.body;

		const categoryQueryData = [name, description, identifier];

		const result = await categoryService.createCategory(categoryQueryData);

		res.status(200).json({
			status: "success",
			data: { newCategory: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateCategory = async (req: Request, res: Response) => {
	try {
		const { categoryId } = req.params;
		const { name, description, identifier } = req.body;

		const updatedCategoryData = [name, description, identifier];

		const result = await categoryService.updateCategory(updatedCategoryData, categoryId);

		res.status(200).json({
			status: "success",
			data: { updatedCategory: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const { categoryId } = req.params;

		const result = await categoryService.deleteCategory(categoryId);

		res.status(200).json({
			status: "success",
			data: { deletedCategory: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
