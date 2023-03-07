// Dependencies
import { Request, Response, NextFunction } from "express";

// Types
import { Address } from "../../interfaces";

// Services
import { addressService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const getAllUserAddress = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const result = await addressService.getAllUserAddress(userId);

		res.status(200).json({
			status: "success",
			data: { address: result.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const {
			recipient_name,
			contact,
			address,
			is_default,
			province,
			province_id,
			city,
			city_id,
			subdistrict,
			subdistrict_id,
			postal_code,
			label,
			shipping_note
		}: Address = req.body;

		const addressQueryData = [
			userId,
			recipient_name,
			contact,
			address,
			is_default,
			province,
			province_id,
			city,
			city_id,
			subdistrict,
			subdistrict_id,
			postal_code,
			label,
			shipping_note
		];

		const result = await addressService.createAddress(addressQueryData, is_default, userId);

		res.status(200).json({
			status: "success",
			data: { newAddress: result.rows[0] }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const { addressId } = req.params;
		const {
			recipient_name,
			contact,
			address,
			is_default,
			province,
			province_id,
			city,
			city_id,
			subdistrict,
			subdistrict_id,
			postal_code,
			label,
			shipping_note
		} = req.body;

		const updatedAddressData: Partial<Address> = {
			recipient_name,
			contact,
			address,
			is_default,
			province,
			province_id,
			city,
			city_id,
			subdistrict,
			subdistrict_id,
			postal_code,
			label,
			shipping_note
		};

		const result = await addressService.updateAddress(
			{
				updatedAddressData,
				addressId,
				userId
			},
			is_default
		);

		res.status(200).json({
			status: "success",
			data: { updatedAddress: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId || typeof userId !== "number") {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const { addressId } = req.params;
		const result = await addressService.deleteAddress(addressId, userId);

		res.status(200).json({
			status: "success",
			data: { deletedAddress: result.rows[0] }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
