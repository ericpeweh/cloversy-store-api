// Dependencies
import { Request, Response } from "express";

// Services
import { brandService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

export const getAllBrands = async (req: Request, res: Response) => {
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

		const { brands, ...paginationData } = await brandService.getAllBrands(page, q, sortBy);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { brands: brands.rows }
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
