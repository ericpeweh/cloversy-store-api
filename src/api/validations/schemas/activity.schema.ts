// Dependencies
import Joi from "joi";

export const postTrackUserLastSeenProductBodySchema = Joi.object({
	productId: Joi.string().pattern(/^\d+$/).required().messages({
		"string.pattern.base": "Please provide a valid 'productId'."
	})
});
