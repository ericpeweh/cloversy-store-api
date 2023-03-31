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

const baseTransactionIdValidationSchema = {
	transactionId: Joi.string().length(10).messages({
		"string.length": "Invalid transaction id!"
	})
};

export const getSingleTransactionParamsSchema = Joi.object({
	...baseTransactionIdValidationSchema
});

export const updateTransactionParamsSchema = Joi.object({
	...baseTransactionIdValidationSchema
});

export const cancelTransactionParamsSchema = Joi.object({
	...baseTransactionIdValidationSchema
});

export const postReviewTransactionParamsSchema = Joi.object({
	...baseTransactionIdValidationSchema
});

export const postReviewTransactionBodySchema = Joi.object({
	reviews: Joi.array().items(
		Joi.object({
			product_id: Joi.number().required(),
			rating: Joi.number().min(1).max(10).required(),
			review: Joi.string().max(200).required()
		}).required()
	)
});

export const updateTransactionBodySchema = Joi.object({
	orderNote: Joi.string().allow("").optional(),
	customerNote: Joi.string().allow("").optional(),
	giftNote: Joi.string().allow("").optional(),
	shippingTrackingCode: Joi.string().allow("").optional(),
	timelineObj: Joi.string().required()
});

export const patchChangeTransactionStatusParamsSchema = Joi.object({
	transactionId: Joi.string().allow("").length(10).optional().messages({
		"string.length": "Invalid transaction id!"
	})
});

export const patchChangeTransactionStatusBodySchema = Joi.object({
	orderStatus: Joi.string().valid("pending", "process", "sent", "success", "cancel").required()
});

export const postCreateTransactionBodySchema = Joi.object({
	voucher_code: Joi.string().length(10).allow("").optional(),
	address_id: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Invalid address id"
	}),
	customer_note: Joi.string().allow("").optional(),
	gift_note: Joi.string().allow("").optional(),
	shipping_courier: Joi.string().required(),
	payment_method: Joi.string().valid("gopay", "bni", "mandiri", "permata", "bri").required()
});
