// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { brandService } from "../../services/client";

export const getAllBrands = async (_: Request, res: Response, next: NextFunction) => {
	try {
		const { brandsResult } = await brandService.getAllBrands();

		res.status(200).json({
			status: "success",
			data: { brands: brandsResult.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
