// Dependencies
import Joi from "joi";

export const getAllCategoriesQuerySchema = Joi.object({
	sortBy: Joi.string().valid("product_amount", "a-z", "z-a", "id", "").optional(),
	q: Joi.string().allow("").optional(),
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	})
});

export const createCategoryBodySchema = Joi.object({
	name: Joi.string().max(50).required(),
	description: Joi.string().allow("").optional(),
	identifier: Joi.string().max(50).required()
});

export const updateCategoryBodySchema = Joi.object({
	name: Joi.string().max(50).required(),
	description: Joi.string().allow("").optional(),
	identifier: Joi.string().max(50).required()
});

export const updateCategoryParamsSchema = Joi.object({
	categoryId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'categoryId'."
	})
});

export const deleteCategoryParamsSchema = Joi.object({
	categoryId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'categoryId'."
	})
});
