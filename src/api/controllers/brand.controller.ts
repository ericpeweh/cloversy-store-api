// Dependencies
import { Request, Response } from "express";

// Services
import { brandService } from "../services";

// Types

export const getAllBrands = async (req: Request, res: Response) => {
	try {
		const result = await brandService.getAllBrands();

		res.status(200).json({
			status: "success",
			data: { brands: result.rows }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const createBrand = async (req: Request, res: Response) => {
	try {
		const { name, identifier } = req.body;

		const brandQueryData = [name, identifier];

		const result = await brandService.createBrand(brandQueryData);

		res.status(200).json({
			status: "success",
			data: { newBrand: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateBrand = async (req: Request, res: Response) => {
	try {
		const { brandId } = req.params;
		const { name, identifier } = req.body;

		const updatedBrandData = [name, identifier];

		const result = await brandService.updateBrand(updatedBrandData, brandId);

		res.status(200).json({
			status: "success",
			data: { updatedBrand: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const deleteBrand = async (req: Request, res: Response) => {
	try {
		const { brandId } = req.params;

		const result = await brandService.deleteBrand(brandId);

		res.status(200).json({
			status: "success",
			data: { deletedBrand: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
