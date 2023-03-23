// Dependencies
import Joi from "joi";

export const postTrackUserLastSeenProductBodySchema = Joi.object({
	productId: Joi.number().required()
});
