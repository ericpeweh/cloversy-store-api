// Dependencies
import { Response, NextFunction, Request } from "express";

// Utils
import { ClientError } from "../utils/errorClass";

const errorHandler = async (error: any, _: Request, res: Response, _1: NextFunction) => {
	if (error.name === "UnauthorizedError") {
		const isValidStatusCode = !isNaN(error?.status);
		return res.status(isValidStatusCode ? error?.status : 401).json({
			status: "error",
			message: "Failed to authenticate / authorize on requested resource"
		});
	} else if (error instanceof ClientError) {
		const isValidStatusCode = !isNaN(error?.code);
		return res.status(isValidStatusCode ? error?.code : 400).json({
			status: "error",
			message: error.message
		});
	} else {
		// Handle all server error
		const isValidStatusCode = !isNaN(error?.code);
		return res.status(isValidStatusCode ? error?.code : 500).json({
			status: "error",
			message:
				"An error occured on our server, please try again later. If error persists, please contact us for more information."
		});
	}
};

export default errorHandler;
