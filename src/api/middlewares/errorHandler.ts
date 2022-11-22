// Dependencies
import { Response, NextFunction, Request } from "express";

const errorHandler = async (error: any, _: Request, res: Response, _1: NextFunction) => {
	if (error.name === "UnauthorizedError") {
		return res.status(error.status).json({ status: "error", message: error.message });
	} else {
		return res.status(500).json({
			status: "error",
			message: error.message
		});
	}
};

export default errorHandler;
