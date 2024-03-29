// Config
import db from "../../../config/connectDB";

// Types
import { QueryResult } from "pg";
import { Address, UpdateAddressDataArgs } from "../../interfaces";

// Utils
import { generateUpdateQuery } from "../../utils";

export const getAllUserAddress = async (userId: string) => {
	const addressQuery = `SELECT address_id AS id, address_contact AS contact, address.* 
    FROM address
    WHERE user_id = $1
    ORDER BY is_default DESC, address_id ASC
  `;

	const addressResult = await db.query(addressQuery, [userId]);
	return addressResult;
};

export const getSingleUserAddress = async (addressId: string) => {
	const addressQuery = `SELECT address_id AS id, address_contact AS contact, address.* 
    FROM address
    WHERE address_id = $1
    ORDER BY is_default DESC, address_id ASC
  `;

	const addressResult: QueryResult<Address> = await db.query(addressQuery, [addressId]);
	return addressResult;
};

export const createAddress = async (
	addressData: Array<any>,
	isDefault: boolean,
	userId: string
) => {
	if (isDefault) {
		const setDefaultQuery = "UPDATE address SET is_default = false WHERE user_id = $1";

		await db.query(setDefaultQuery, [userId]);
	}

	const query = `INSERT INTO address(
    user_id,
    recipient_name,
    address_contact,
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
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;

	const result = await db.query(query, addressData);

	return result;
};

export const updateAddress = async (
	updateProductData: UpdateAddressDataArgs,
	isDefault: boolean
) => {
	const { updatedAddressData, addressId, userId } = updateProductData;

	if (isDefault) {
		const setDefaultQuery = "UPDATE address SET is_default = false WHERE user_id = $1";

		await db.query(setDefaultQuery, [userId]);
	}

	const { query: addressQuery, params: productParams } = generateUpdateQuery(
		"address",
		updatedAddressData,
		{ address_id: addressId, user_id: userId },
		" RETURNING *"
	);

	const addressResult = await db.query(addressQuery, productParams);

	return addressResult;
};
export const deleteAddress = async (addressId: string, userId: number) => {
	const query = `DELETE FROM address
    WHERE address_id = $1 AND user_id = $2 RETURNING *`;

	const result = await db.query(query, [addressId, userId]);

	return result;
};

export const getAddressById = async (addressId: string) => {
	const addressQuery =
		"SELECT address_id AS id, address_contact AS contact, address.* FROM address WHERE address_id = $1";

	const addressResult = await db.query(addressQuery, [addressId]);

	return addressResult;
};
