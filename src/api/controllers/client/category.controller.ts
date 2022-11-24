// Dependencies
import { Request, Response } from "express";

// Services
import { categoryService } from "../../services/client";

export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const { categories } = await categoryService.getAllCategories();

		res.status(200).json({
			status: "success",
			data: { categories: categories.rows }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
