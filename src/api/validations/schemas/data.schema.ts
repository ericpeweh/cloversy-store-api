// Dependencies
import Joi from "joi";

export const getCitiesByProvinceIdQuerySchema = Joi.object({
	province: Joi.number().required()
});

export const getSubdistrictByCityIdQuerySchema = Joi.object({
	city: Joi.number().required()
});

export const getShippingCostBySubdistrictBodySchema = Joi.object({
	addressId: Joi.number().required()
});
