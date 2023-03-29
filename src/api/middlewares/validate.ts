// Dependencies
import { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

const validate = (schema: Schema, property: "body" | "params" | "query" | "") => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(property === "" ? req : req[property]);

		if (error) {
			// Return error validation response
			const { details } = error;
			const message = details.map(item => item.message).join(", ");

			res.status(400).json({ status: "error", message: `Validation error: ${message}` });
		} else {
			// Continue if valid
			return next();
		}
	};
};

export default validate;
