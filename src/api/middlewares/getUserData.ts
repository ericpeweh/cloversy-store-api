// Dependencies
import { Response, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";

// Service
import { userService } from "../services";

// Utils
import { ErrorObj } from "../utils";

const getUserData = async (req: JWTRequest, _: Response, next: NextFunction) => {
	try {
		if (req.auth === undefined) {
			throw new ErrorObj.ServerError("Failed to check user authority, please try again.");
		}
		const user = await userService.getUserDataBySub(req.auth.sub);
		if (user) {
			req.user = user;
		} else {
			throw new ErrorObj.ServerError("Failed to get user data.");
		}

		return next();
	} catch (error: unknown) {
		return next(error);
	}
};

export default getUserData;
