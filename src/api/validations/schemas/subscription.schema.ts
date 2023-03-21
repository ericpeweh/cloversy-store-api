// Dependencies
import Joi from "joi";

export const getPushSubscriptionsQuerySchema = Joi.object({
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	q: Joi.string().allow("").optional()
});
