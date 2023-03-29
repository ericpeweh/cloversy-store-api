// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { brandService } from "../services";

export const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
	const { page = "", q = "", sortBy = "id" } = req.query;

	try {
		const { brands, ...paginationData } = await brandService.getAllBrands(
			page as string,
			q as string,
			sortBy as string
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { brands: brands }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const createBrand = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, identifier } = req.body;

		const brandQueryData = [name, identifier];

		const result = await brandService.createBrand(brandQueryData);

		res.status(201).json({
			status: "success",
			data: { newBrand: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { brandId } = req.params;
		const { name, identifier } = req.body;

		const updatedBrandData = [name, identifier];

		const result = await brandService.updateBrand(updatedBrandData, brandId);

		res.status(200).json({
			status: "success",
			data: { updatedBrand: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { brandId } = req.params;

		const result = await brandService.deleteBrand(brandId);

		res.status(200).json({
			status: "success",
			data: { deletedBrand: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
