// Dependencies
import Joi from "joi";

export const postAddProductToCartBodySchema = Joi.object({
	product_id: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'product_id'."
	}),
	quantity: Joi.number().min(1).required(),
	size: Joi.string()
		.pattern(/(\d*\.?\d+)/)
		.required()
		.messages({
			"string.pattern.base": "Please provide a valid product 'size'."
		})
});

const baseCartItemIdSchema = {
	id: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'id' for cart item."
	})
};

export const patchUpdateCartItemBodySchema = Joi.object({
	...baseCartItemIdSchema,
	quantity: Joi.number().min(1).required()
});

export const deleteCartItemBodySchema = Joi.object({ ...baseCartItemIdSchema });
