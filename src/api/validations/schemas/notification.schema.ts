// Dependencies
import Joi from "joi";

export const getAllNotificationsQuerySchema = Joi.object({
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	limit: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'limit'."
	}),
	type: Joi.string().allow("").valid("transaction", "marketing", "message", "system", "")
});

export const postReadNotificationParamsSchema = Joi.object({
	notificationId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'notificationId'."
	})
});
