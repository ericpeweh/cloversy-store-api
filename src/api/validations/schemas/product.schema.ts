// Dependencies
import Joi from "joi";

export const getNotifMarketingsQuerySchema = Joi.object({
	status: Joi.string().valid("active", "disabled", "").allow("").optional(),
	brand: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'brand' id."
	}),
	sortBy: Joi.string()
		.allow("")
		.valid("low-to-high", "high-to-low", "rating", "popularity", "id", "")
		.optional(),
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	q: Joi.string().allow("").optional()
});

export const getSingleProductByIdParamsSchema = Joi.object({
	productId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'productId'."
	})
});

export const getSingleProductByIdQuerySchema = Joi.object({
	sales_analytic_year: Joi.string()
		.regex(/^[1-9][0-9]{3}$/) // validate > 1000 and < 10000
		.allow("")
		.optional()
		.messages({
			"string.pattern.base":
				"Invalid 'sales_analytic_year' query param. Please provide a valid year."
		}),
	visitor_analytic_year: Joi.string()
		.regex(/^[1-9][0-9]{3}$/)
		.allow("")
		.optional()
		.messages({
			"string.pattern.base":
				"Invalid 'sales_analytic_year' query param. Please provide a valid year."
		})
});

const baseModifyProductBodySchema = {
	title: Joi.string().max(100).required(),
	sku: Joi.string().max(50).required(),
	price: Joi.number().min(0).required(),
	status: Joi.string().valid("active", "disabled").required(),
	category_id: Joi.number().required(),
	brand_id: Joi.number().required(),
	description: Joi.string().allow("").optional(),
	slug: Joi.string().max(100).required(),
	tags: Joi.array().items(Joi.string()).min(1),
	sizes: Joi.array().items(Joi.string()).min(1)
};

export const createProductBodySchema = Joi.object({ ...baseModifyProductBodySchema });

export const createProductRequestSchema = Joi.object({
	files: Joi.array()
		.items(Joi.object())
		.required()
		.messages({ "any.required": "Product images is required!" })
}).unknown();

export const updateProductParamsSchema = Joi.object({
	productId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'productId'."
	})
});

export const updateProductBodySchema = Joi.object({
	...baseModifyProductBodySchema,
	removedTags: Joi.array().items(Joi.string()),
	removedSizes: Joi.array().items(Joi.string()),
	removedImages: Joi.array().items(Joi.string())
});

export const updateProductRequestSchema = Joi.object({
	files: Joi.array().items(Joi.object()).optional()
}).unknown();

export const deleteProductParamsSchema = Joi.object({
	productId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'productId'."
	})
});
