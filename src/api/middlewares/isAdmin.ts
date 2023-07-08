// Dependencies
import { Response, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";

// Service
import { userService } from "../services";

// Utils
import { ErrorObj } from "../utils";

const isAdmin = async (req: JWTRequest, res: Response, next: NextFunction) => {
	try {
		if (req.auth === undefined) {
			throw new ErrorObj.ClientError("Failed to check user authority, please try again.", 401);
		}
		const user = await userService.getUserDataBySub(req.auth.sub || "");
		const userRole = user.user_role;

		if (userRole !== "admin") {
			throw new ErrorObj.ClientError("Access denied", 403);
		}

		return next();
	} catch (error: unknown) {
		return next(error);
	}
};

export default isAdmin;
