// Dependencies
import { Request, Response } from "express";

// Services
import { categoryService } from "../services";

// Types

export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const result = await categoryService.getAllCategories();

		res.status(200).json({
			status: "success",
			data: { categories: result.rows }
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
