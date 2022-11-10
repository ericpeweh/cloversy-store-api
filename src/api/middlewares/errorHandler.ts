// Dependencies
import { Response, NextFunction, Request } from "express";

const errorHandler = async (error: any, _: Request, res: Response, _1: NextFunction) => {
	if (error.name === "UnauthorizedError") {
		res.status(error.status).json({ status: "error", message: error.message });
		return;
	}
};

export default errorHandler;
