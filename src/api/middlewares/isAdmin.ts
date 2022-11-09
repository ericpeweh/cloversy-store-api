// Dependencies
import { Response, NextFunction, Request } from "express";

// Utils
import { ErrorObj } from "../utils";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.user === undefined) {
			throw new ErrorObj.ServerError("Unknown user");
		}
		const userRole = req.user?.user_role;

		if (userRole !== "admin") {
			throw new ErrorObj.ClientError("Access denied", 403);
		}

		next();
	} catch (error: any) {
		return res.status(error.statusCode).json({
			status: "error",
			message: error.message
		});
	}
};

export default isAdmin;
