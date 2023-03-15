// Dependencies
import JoiBase, { Root } from "joi";
import JoiPhoneNumber from "joi-phone-number";

const Joi: Root = JoiBase.extend(JoiPhoneNumber);

export const updateUserAccountDetailsSchema = Joi.object({
	full_name: Joi.string().required(),
	contact: Joi.string()
		.phoneNumber({ defaultCountry: "ID", strict: true })
		.regex(/^08\d{8,11}$/)
		.messages({
			"object.regex": "Invalid phone number!"
		}),
	birth_date: Joi.date().required()
});

export const putUserProfilePictureSchema = Joi.object({
	file: Joi.object().required().messages({ "any.required": "File is required!" })
}).unknown();
