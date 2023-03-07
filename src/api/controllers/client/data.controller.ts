// Dependencies
import { Response, Request, NextFunction } from "express";

// Services
import { dataService, addressService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const getAllProvinces = async (_: Request, res: Response, next: NextFunction) => {
	try {
		const provinces = await dataService.getAllProvinces();

		res.status(200).json({
			status: "success",
			data: {
				provinces
			}
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getCitiesByProvinceId = async (req: Request, res: Response, next: NextFunction) => {
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
	} catch (error: unknown) {
		return next(error);
	}
};

export const getSubdistrictByCityId = async (req: Request, res: Response, next: NextFunction) => {
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
	} catch (error: unknown) {
		return next(error);
	}
};

export const getShippingCostBySubdistrict = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
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
				costs: result,
				query: {
					addressId: +addressId
				}
			}
		});
	} catch (error: unknown) {
		return next(error);
	}
};
