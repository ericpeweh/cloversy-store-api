// Dependencies
import Joi from "joi";

export const getAllBrandsQuerySchema = Joi.object({
	sortBy: Joi.string().valid("product_amount", "a-z", "z-a", "id", "").optional(),
	q: Joi.string().allow("").optional(),
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	})
});

export const createBrandBodySchema = Joi.object({
	name: Joi.string().max(50).required(),
	identifier: Joi.string().max(50).required()
});

export const updateBrandBodySchema = Joi.object({
	name: Joi.string().max(50).required(),
	identifier: Joi.string().max(50).required()
});

export const updateBrandParamsSchema = Joi.object({
	brandId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'brandId'."
	})
});

export const deleteBrandParamsSchema = Joi.object({
	brandId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'brandId'."
	})
});
