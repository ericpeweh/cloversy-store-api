// Dependencies
import { Request } from "express-jwt";
import { Response, NextFunction } from "express";

const passAuth = async (error: any, _: Request, res: Response, next: NextFunction) => {
	if (error.name === "UnauthorizedError") {
		next();
	} else {
		return res.status(500).json({
			status: "error",
			message: error.message
		});
	}
};

export default passAuth;
