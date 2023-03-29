// Dependencies
import Joi from "joi";

export const postCreateMessageWebFormBodySchema = Joi.object({
	senderName: Joi.string().max(255).required(),
	email: Joi.string().email().required(),
	objective: Joi.string().valid("Produk", "Website / Store", "Partnership", "Lainnya").required(),
	title: Joi.string().max(255).required(),
	message: Joi.string().max(1000).required()
});
