// Dependencies
import JoiBase, { Root } from "joi";
import JoiPhoneNumber from "joi-phone-number";

const Joi: Root = JoiBase.extend(JoiPhoneNumber);

export const updateUserAccountDetailsSchema = Joi.object({
	full_name: Joi.string().required(),
	contact: Joi.string()
		.phoneNumber({ defaultCountry: "ID", strict: true })
		.regex(/^08\d{8,11}$/)
		.messages({
			"object.regex": "Invalid phone number!"
		}),
	birth_date: Joi.date().required()
});

export const putUserProfilePictureSchema = Joi.object({
	file: Joi.object().required().messages({ "any.required": "File is required!" })
}).unknown();

// Address routes
const modifyAddressBodySchema = {
	recipient_name: Joi.string().max(100).required(),
	contact: Joi.string()
		.phoneNumber({ defaultCountry: "ID", strict: true })
		.regex(/^08\d{8,11}$/)
		.messages({
			"object.regex": "Invalid phone number!"
		}),
	address: Joi.string().required(),
	is_default: Joi.boolean().required(),
	province: Joi.string().max(100).required(),
	province_id: Joi.number().required(),
	city: Joi.string().max(100).required(),
	city_id: Joi.number().required(),
	subdistrict: Joi.string().max(100).required(),
	subdistrict_id: Joi.number().required(),
	postal_code: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Mohon masukkan kode pos yang valid."
	}),
	label: Joi.string().max(100).required(),
	shipping_note: Joi.string().allow("").optional()
};

export const createAddressBodySchema = Joi.object({ ...modifyAddressBodySchema });

export const updateAddressParamsSchema = Joi.object({
	addressId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'addressId'."
	})
});

export const updateAddressBodySchema = Joi.object({
	...modifyAddressBodySchema
});

export const deleteAddressParamsSchema = Joi.object({
	addressId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'addressId'."
	})
});

// Wishlist routes
const baseProductIdValidation = {
	productId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'productId'."
	})
};

export const postAddProductToWishlistParamsSchema = Joi.object({ ...baseProductIdValidation });

export const deleteProductFromWishlistParamsSchema = Joi.object({ ...baseProductIdValidation });
