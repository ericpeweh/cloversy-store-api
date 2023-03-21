// Dependencies
import Joi from "joi";

export const getTransactionsQuerySchema = Joi.object({
	userId: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'userId'."
	}),
	status: Joi.string()
		.allow("")
		.valid("pending", "process", "sent", "success", "cancel", "")
		.optional(),
	q: Joi.string().allow("").optional(),
	sortBy: Joi.string()
		.allow("")
		.valid("low-to-high", "high-to-low", "order_status", "created_at", "id", "")
		.optional(),
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	limit: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'limit'."
	})
});

export const getSingleTransactionQuerySchema = Joi.object({
	edit: Joi.string().allow("").valid("1", "0").optional()
});

export const getSingleTransactionParamsSchema = Joi.object({
	transactionId: Joi.string().allow("").length(10).optional().messages({
		"string.length": "Invalid transaction id!"
	})
});

export const updateTransactionParamsSchema = Joi.object({
	transactionId: Joi.string().allow("").length(10).optional().messages({
		"string.length": "Invalid transaction id!"
	})
});

export const updateTransactionBodySchema = Joi.object({
	orderNote: Joi.string().allow("").optional(),
	customerNote: Joi.string().allow("").optional(),
	giftNote: Joi.string().allow("").optional(),
	shippingTrackingCode: Joi.string().allow("").optional(),
	timelineObj: Joi.object().optional()
});

export const patchChangeTransactionStatusParamsSchema = Joi.object({
	transactionId: Joi.string().allow("").length(10).optional().messages({
		"string.length": "Invalid transaction id!"
	})
});

export const patchChangeTransactionStatusBodySchema = Joi.object({
	orderStatus: Joi.string().valid("pending", "process", "sent", "success", "cancel").required()
});
