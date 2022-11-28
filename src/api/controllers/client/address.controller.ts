// Dependencies
import { Request, Response } from "express";

// Types
import { Address } from "../../interfaces";

// Services
import { addressService } from "../../services/client";
import { ErrorObj } from "../../utils";

// Types

export const getAllUserAddress = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const createAddress = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const updateAddress = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
