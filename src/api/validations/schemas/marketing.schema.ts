// Dependencies
import Joi from "joi";

/* ===================================
  NOTIFICATION MARKETINGS
=================================== */
export const getNotifMarketingsQuerySchema = Joi.object({
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	q: Joi.string().allow("").optional(),
	scheduled: Joi.boolean()
});

export const getNotifMarketingDetailsParamsSchema = Joi.object({
	notifMarketingId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'notifMarketingId'."
	})
});

const basePostNotifMarketingBodySchema = {
	title: Joi.string().required(),
	description: Joi.string().allow("").optional(),
	scheduled: Joi.date().iso().allow(null).optional(),
	selectedUserIds: Joi.array().items(Joi.string(), Joi.number()),
	message_title: Joi.string().required(),
	message_body: Joi.string().required(),
	image_url: Joi.string().allow("").optional(),
	deeplink_url: Joi.string().allow("").optional(),
	action_link: Joi.string().allow("").optional(),
	action_title: Joi.string().allow("").optional(),
	sendTo: Joi.string().valid("all", "selected")
};

export const createNotifMarketingBodySchema = Joi.object(basePostNotifMarketingBodySchema);

export const cancelNotifMarketingParamsSchema = Joi.object({
	notifMarketingId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'notifMarketingId'."
	})
});

export const updateNotifMarketingBodySchema = Joi.object({
	...basePostNotifMarketingBodySchema,
	removedUserIds: Joi.array().items(Joi.string(), Joi.number())
});

/* ===================================
  EMAIL MARKETINGS
=================================== */
export const getEmailMarketingsQuerySchema = Joi.object({
	page: Joi.string().allow("").pattern(/^\d+$/).optional().messages({
		"string.pattern.base": "Please provide a valid 'page'."
	}),
	q: Joi.string().allow("").optional(),
	scheduled: Joi.boolean()
});

export const getEmailMarketingDetailsParamsSchema = Joi.object({
	emailMarketingId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'emailMarketingId'."
	})
});

const basePostEmailMarketingBodySchema = {
	title: Joi.string().required(),
	description: Joi.string().allow("").optional(),
	scheduled: Joi.date().iso().allow(null).optional(),
	selectedUserIds: Joi.array().items(Joi.string(), Joi.number()).max(100).min(1).messages({
		"array.min": "Selected users can't be empty",
		"array.max": "Maximum selected users exceeded (max 100 users)."
	}),
	email_subject: Joi.string().required(),
	params: Joi.object().required(),
	templateId: Joi.number().required()
};

export const createEmailMarketingBodySchema = Joi.object({
	...basePostEmailMarketingBodySchema,
	sendTo: Joi.string().equal("selected")
});

export const cancelEmailMarketingParamsSchema = Joi.object({
	emailMarketingId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'emailMarketingId'."
	})
});

export const updateEmailMarketingBodySchema = Joi.object({
	...basePostEmailMarketingBodySchema,
	removedUserIds: Joi.array().items(Joi.string(), Joi.number())
});
