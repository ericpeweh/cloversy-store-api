// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { categoryService } from "../services";

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
	const { page = "", q = "", sortBy = "id" } = req.query;

	try {
		const { categories, ...paginationData } = await categoryService.getAllCategories(
			page as string,
			q as string,
			sortBy as string
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { categories }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, description, identifier } = req.body;

		const categoryQueryData = [name, description, identifier];

		const result = await categoryService.createCategory(categoryQueryData);

		res.status(201).json({
			status: "success",
			data: { newCategory: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { categoryId } = req.params;
		const { name, description, identifier } = req.body;

		const updatedCategoryData = [name, description, identifier];

		const result = await categoryService.updateCategory(updatedCategoryData, categoryId);

		res.status(200).json({
			status: "success",
			data: { updatedCategory: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { categoryId } = req.params;

		const result = await categoryService.deleteCategory(categoryId);

		res.status(200).json({
			status: "success",
			data: { deletedCategory: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
