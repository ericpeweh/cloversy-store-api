// Dependencies
import { Response, Request } from "express";

// Services
import { dataService, addressService } from "../../services/client";
import { ErrorObj } from "../../utils";

export const getAllProvinces = async (req: Request, res: Response) => {
	try {
		const provinces = await dataService.getAllProvinces();

		res.status(200).json({
			status: "success",
			data: {
				provinces
			}
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getCitiesByProvinceId = async (req: Request, res: Response) => {
	const { province: provinceId } = req.query;

	try {
		if (typeof provinceId !== "string") {
			throw new ErrorObj.ClientError("Invalid province id");
		}

		const cities = await dataService.getCitiesByProvinceId(provinceId);

		res.status(200).json({
			status: "success",
			data: {
				cities
			}
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSubdistrictByCityId = async (req: Request, res: Response) => {
	const { city: cityId } = req.query;

	try {
		if (typeof cityId !== "string") {
			throw new ErrorObj.ClientError("Invalid city id");
		}

		const subdistricts = await dataService.getSubdistrictByCityId(cityId);

		res.status(200).json({
			status: "success",
			data: {
				subdistricts
			}
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getShippingCostBySubdistrict = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { addressId } = req.body;

	try {
		if (isNaN(+addressId)) {
			throw new ErrorObj.ClientError("Invalid address id");
		}

		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const subdistrictId = (await addressService.getSingleUserAddress(userId, addressId))
			.subdistrict_id;

		if (!subdistrictId) {
			throw new ErrorObj.ClientError("Address not found", 404);
		}

		const result = await dataService.getShippingCostBySubdistrict(subdistrictId);

		res.status(200).json({
			status: "success",
			data: {
				costs: result
			}
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
