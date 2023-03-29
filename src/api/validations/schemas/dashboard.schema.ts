// Dependencies
import Joi from "joi";

export const getDashboardDataQuerySchema = Joi.object({
	sales_analytic_year: Joi.string()
		.regex(/^[1-9][0-9]{3}$/) // validate > 1000 and < 10000
		.allow("")
		.optional()
		.messages({
			"string.pattern.base":
				"Invalid 'sales_analytic_year' query param. Please provide a valid year."
		}),
	visitor_analytic_year: Joi.string()
		.regex(/^[1-9][0-9]{3}$/)
		.allow("")
		.optional()
		.messages({
			"string.pattern.base":
				"Invalid 'sales_analytic_year' query param. Please provide a valid year."
		})
});
