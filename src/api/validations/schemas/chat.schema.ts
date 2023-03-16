// Dependencies
import Joi from "joi";

export const getConversationListQuerySchema = Joi.object({
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	})
});

export const getConversationParamsSchema = Joi.object({
	conversationId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'conversationId'."
	})
});

export const getConversationQuerySchema = Joi.object({
	currentCursor: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'currentCursor'."
	})
});
