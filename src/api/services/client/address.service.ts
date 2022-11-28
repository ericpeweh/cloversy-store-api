// Data
import { addressRepo } from "../../data/client";

// Types
import { UpdateAddressDataArgs } from "../../interfaces";

// Utils
import { ErrorObj } from "../../utils";

export const getAllUserAddress = async (userId: string) => {
	try {
		const address = await addressRepo.getAllUserAddress(userId);

		return address;
	} catch (error) {
		throw error;
	}
};

export const createAddress = async (addressData: any[], isDefault: boolean, userId: string) => {
	const newAddress = await addressRepo.createAddress(addressData, isDefault, userId);

	return newAddress;
};

export const updateAddress = async (data: UpdateAddressDataArgs, isDefault: boolean) => {
	const { addressId, userId } = data;

	const address = await addressRepo.getAddressById(addressId);

	if (address.rows.length === 0) {
		throw new ErrorObj.ClientError("Address not found!", 404);
	}

	if (address.rows[0].user_id !== userId) {
		throw new ErrorObj.ClientError("Not authorized!", 403);
	}

	const addressResult = await addressRepo.updateAddress(data, isDefault);

	return addressResult;
};

export const deleteAddress = async (addressId: string, userId: number) => {
	const address = await addressRepo.getAddressById(addressId);

	if (address.rows.length === 0) {
		throw new ErrorObj.ClientError("Address not found!", 404);
	}

	if (address.rows[0].user_id !== userId) {
		throw new ErrorObj.ClientError("Not authorized!", 403);
	}

	const result = await addressRepo.deleteAddress(addressId, userId);

	return result;
};
