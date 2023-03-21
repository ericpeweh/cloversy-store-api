// Dependencies
import Joi from "joi";

export const getAllVouchersQuerySchema = Joi.object({
	status: Joi.string().valid("active", "disabled", "").allow("").optional(),
	sortBy: Joi.string()
		.allow("")
		.valid("current_usage", "latest", "expiry_date", "id", "")
		.optional(),
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	limit: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'limit'."
	})
});

const baseVoucherCodeValidationSchema = {
	voucherCode: Joi.string().length(10).required()
};

export const getSingleVoucherParamsSchema = Joi.object({
	...baseVoucherCodeValidationSchema
});

export const getSingleVoucherQuerySchema = Joi.object({
	analytic_year: Joi.string()
		.regex(/^[1-9][0-9]{3}$/) // validate > 1000 and < 10000
		.allow("")
		.optional()
		.messages({
			"string.pattern.base": "Invalid 'analytic_year' query param. Please provide a valid year."
		})
});

const baseModifyVoucherBodySchema = {
	code: Joi.string().length(10).required(),
	title: Joi.string().max(255).required(),
	expiry_date: Joi.date().iso().allow("").optional(),
	status: Joi.string().valid("active", "disabled").required(),
	usage_limit: Joi.number().min(0).optional(),
	discount: Joi.number().min(0).required(),
	discount_type: Joi.string().valid("value", "percentage").required(),
	voucher_scope: Joi.string().valid("global", "user").required(),
	description: Joi.string().allow("").optional(),
	selectedUserIds: Joi.array().items(Joi.number(), Joi.string())
};

export const createVoucherBodySchema = Joi.object({ ...baseModifyVoucherBodySchema });

export const updateVoucherParamsSchema = Joi.object({ ...baseVoucherCodeValidationSchema });

export const updateVoucherBodySchema = Joi.object({
	...baseModifyVoucherBodySchema,
	removedUserIds: Joi.array().items(Joi.number(), Joi.string())
});
