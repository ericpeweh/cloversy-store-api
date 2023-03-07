// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { categoryService } from "../../services/client";

export const getAllCategories = async (_: Request, res: Response, next: NextFunction) => {
	try {
		const { categories } = await categoryService.getAllCategories();

		res.status(200).json({
			status: "success",
			data: { categories: categories.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
