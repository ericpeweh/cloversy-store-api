// Dependencies
import Joi from "joi";

export const getCitiesByProvinceIdQuerySchema = Joi.object({
	province: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'province' id."
	})
});

export const getSubdistrictByCityIdQuerySchema = Joi.object({
	city: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'city' id."
	})
});

export const getShippingCostBySubdistrictBodySchema = Joi.object({
	addressId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'addressId'."
	})
});
