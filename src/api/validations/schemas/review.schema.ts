// Dependencies
import Joi from "joi";

export const getAllReviewsQuerySchema = Joi.object({
	q: Joi.string().allow("").optional(),
	status: Joi.string().valid("active", "disabled", "").allow("").optional(),
	sortBy: Joi.string().allow("").valid("id", "status", "rating", "created_at").optional(),
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	limit: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'limit'."
	}),
	transactionId: Joi.string().allow("").length(10).optional().messages({
		"string.length": "Invalid transaction id!"
	})
});

export const getSingleReviewParamsSchema = Joi.object({
	reviewId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'reviewId'."
	})
});

export const updateReviewParamsSchema = Joi.object({
	reviewId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'reviewId'."
	})
});

export const updateReviewBodySchema = Joi.object({
	rating: Joi.number().min(1).max(10).required().messages({
		"number.min": "Rating must be between 1 to 10!",
		"number.max": "Rating must be between 1 to 10!"
	}),
	review: Joi.string().max(200).required().messages({
		"string.max": "Review description length exceeded, max 200 characteres."
	}),
	created_at: Joi.date().iso().required(),
	status: Joi.string().valid("active", "disabled").required().messages({
		"string.base": "Invalid review status"
	})
});
