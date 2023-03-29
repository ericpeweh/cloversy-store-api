// Dependencies
import Joi from "joi";

export const getPushSubscriptionsQuerySchema = Joi.object({
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	q: Joi.string().allow("").optional()
});

export const postSubscribeToEmailBodySchema = Joi.object({
	email: Joi.string().email().required()
});

export const deleteUnsubscribeFromEmailBodySchema = Joi.object({
	email: Joi.string().email().required()
});

export const postSubscribeToPushBodySchema = Joi.object({
	token: Joi.string().required()
});

export const deleteUnsubscribeFromPushBodySchema = Joi.object({
	subscriptionId: Joi.string().required()
});
