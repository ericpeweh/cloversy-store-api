// Dependencies
import Joi from "joi";

export const postCreateMessageWebFormBodySchema = Joi.object({
	senderName: Joi.string().max(200).required(),
	email: Joi.string().max(254).email().required(),
	objective: Joi.string().valid("Produk", "Website / Store", "Partnership", "Lainnya").required(),
	message_title: Joi.string().max(200).required(),
	message: Joi.string().max(1000).required()
});
