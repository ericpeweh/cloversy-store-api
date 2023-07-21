// Dependencies
import Joi from "joi";

export const postAddProductToCartBodySchema = Joi.object({
	product_id: Joi.number().required(),
	quantity: Joi.number().min(1).required(),
	size: Joi.string()
		.pattern(/(\d*\.?\d+)/)
		.required()
		.messages({
			"string.pattern.base": "Please provide a valid product 'size'."
		})
});

const baseCartItemIdSchema = {
	id: Joi.alternatives().try(Joi.number(), Joi.string())
};

export const patchUpdateCartItemBodySchema = Joi.object({
	...baseCartItemIdSchema,
	quantity: Joi.number().min(1).required()
});

export const deleteCartItemBodySchema = Joi.object({ ...baseCartItemIdSchema });
