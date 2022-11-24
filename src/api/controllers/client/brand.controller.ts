// Dependencies
import { Request, Response } from "express";

// Services
import { brandService } from "../../services/client";

export const getAllBrands = async (_: Request, res: Response) => {
	try {
		const { brandsResult } = await brandService.getAllBrands();

		res.status(200).json({
			status: "success",
			data: { brands: brandsResult.rows }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
