// Dependencies
import JoiBase, { Root } from "joi";
import JoiPhoneNumber from "joi-phone-number";

const Joi: Root = JoiBase.extend(JoiPhoneNumber);

export const getAllCustomersQuerySchema = Joi.object({
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	q: Joi.string().allow("").optional(),
	status: Joi.string().valid("active", "banned", "").allow("").optional()
});

const baseUserIdValidationSchema = {
	userId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'userId'."
	})
};

export const getSingleCustomerParamsSchema = Joi.object({ ...baseUserIdValidationSchema });

export const getSingleCustomerOrdersParamsSchema = Joi.object({ ...baseUserIdValidationSchema });

export const putUpdateUserDataParamsSchema = Joi.object({ ...baseUserIdValidationSchema });

export const putUpdateUserDataBodySchema = Joi.object({
	full_name: Joi.string().max(100).optional(),
	contact: Joi.string()
		.phoneNumber({ defaultCountry: "ID", strict: true })
		.regex(/^08\d{8,11}$/)
		.messages({
			"object.regex": "Invalid phone number!"
		})
		.optional(),
	profile_picture: Joi.string().allow("").optional(),
	user_status: Joi.string().valid("active", "banned").optional(),
	prev_status: Joi.when("user_status", {
		is: Joi.exist(),
		then: Joi.string().valid("active", "banned").required(),
		otherwise: Joi.forbidden()
	}),
	credits: Joi.number().optional()
});
