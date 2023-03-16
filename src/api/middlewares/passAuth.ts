// Dependencies
import { Request } from "express-jwt";
import { Response, NextFunction } from "express";

const passAuth = async (error: any, _: Request, res: Response, next: NextFunction) => {
	if (error.name === "UnauthorizedError") {
		next();
	} else {
		return next(error);
	}
};

export default passAuth;
