// Dependencies
import Joi from "joi";

export const getSalesReportQuerySchema = Joi.object({
	startDate: Joi.date().iso().required(),
	endDate: Joi.date().iso().required()
});
