// Dependencies
import { Response, NextFunction, Request } from "express";

// Utils
import { ClientError } from "../utils/errorClass";

const errorHandler = async (error: any, _: Request, res: Response, _1: NextFunction) => {
	if (error.name === "UnauthorizedError") {
		return res.status(error?.status || 401).json({
			status: "error",
			message: "Failed to authenticate / authorize on requested resource"
		});
	} else if (error instanceof ClientError) {
		return res.status(error?.code || 400).json({
			status: "error",
			message:
				error.message ||
				"Something went wrong, make sure user is sending the correct input values, params, etc."
		});
	} else {
		// Handle all server error
		return res.status(error?.code || 500).json({
			status: "error",
			message:
				"An error occured on our server, please try again later. If error persists, please contact us for more information."
		});
	}
};

export default errorHandler;
