/* eslint-disable no-useless-escape */
// Dependencies
import Joi from "joi";

const getAllProductsBaseSchema = {
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
};

export const getAllProductsQuerySchema = Joi.object({
	...getAllProductsBaseSchema,
	status: Joi.string().valid("active", "disabled", "").allow("").optional()
});

export const getAllProductsClientQuerySchema = Joi.object({
	...getAllProductsBaseSchema,
	count: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid products 'count'."
	}),
	price: Joi.string()
		.allow("")
		.pattern(/(\d+\,\d+)/)
		.optional()
		.messages({
			"string.pattern.base": "Please provide a valid 'price' filter."
		})
});

export const getSingleProductByIdParamsSchema = Joi.object({
	productId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'productId'."
	})
});

export const getSingleProductBySlugParamsSchema = Joi.object({
	productSlug: Joi.string().required()
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
	slug: Joi.string().max(100).required()
};

export const createProductBodySchema = Joi.object({
	...baseModifyProductBodySchema,
	tags: Joi.string()
		.pattern(/^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/) // match for tags: hello,world,test
		.optional()
		.messages({
			"string.pattern.base": "Please provide a valid product 'tags'."
		}),
	sizes: Joi.string()
		.pattern(/^\d+(\.\d+)?(,\d+(\.\d+)?)*$/) // match for sizes: 36,37,37.5,40,41.5
		.optional()
		.messages({
			"string.pattern.base": "Please provide a valid product 'sizes'."
		})
});

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
	tags: Joi.string()
		.pattern(/^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/) // match for tags: hello,world,test
		.optional()
		.allow("")
		.messages({
			"string.pattern.base": "Please provide a valid product 'tags'."
		}),
	sizes: Joi.string()
		.pattern(/^\d+(\.\d+)?(,\d+(\.\d+)?)*$/) // match for sizes: 36,37,37.5,40,41.5
		.optional()
		.allow("")
		.messages({
			"string.pattern.base": "Please provide a valid product 'sizes'."
		}),
	removedTags: Joi.string()
		.pattern(/^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/) // match for tags: hello,world,test
		.optional()
		.allow("")
		.messages({
			"string.pattern.base": "Please provide a valid product 'tags'."
		}),
	removedSizes: Joi.string()
		.pattern(/^\d+(\.\d+)?(,\d+(\.\d+)?)*$/) // match for sizes: 36,37,37.5,40,41.5
		.optional()
		.allow("")
		.messages({
			"string.pattern.base": "Please provide a valid product 'sizes'."
		}),
	removedImages: Joi.string().optional().allow("")
});

export const updateProductRequestSchema = Joi.object({
	files: Joi.array().items(Joi.object()).optional()
}).unknown();

export const deleteProductParamsSchema = Joi.object({
	productId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'productId'."
	})
});
