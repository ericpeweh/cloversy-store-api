// Dependencies
import { Response, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";

// Service
import { userService } from "../services";

const getUserDataOptional = async (req: JWTRequest, res: Response, next: NextFunction) => {
	try {
		if (req.auth === undefined) {
			return next();
		}
		const user = await userService.getUserDataBySub(req.auth.sub);
		if (user) {
			req.user = user;
		}
		next();
	} catch (error: any) {
		return res.status(error.statusCode).json({
			status: "error",
			message: error.message
		});
	}
};

export default getUserDataOptional;
