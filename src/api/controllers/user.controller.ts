// Dependencies
import { Request, Response } from "express";

// Services
import { userService } from "../services";

// Utils
import { ErrorObj } from "../utils";

// Types

export const getAllCustomers = async (req: Request, res: Response) => {
	const { q: searchQuery = "", status: statusQuery = "" } = req.query;

	if (typeof searchQuery !== "string" || typeof statusQuery !== "string") {
		throw new ErrorObj.ClientError("Query param 'q' and 'status' has to be of type string");
	}

	try {
		const result = await userService.getAllCustomers(searchQuery, statusQuery);

		res.status(200).json({
			status: "success",
			data: { customers: result.rows }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSingleCustomer = async (req: Request, res: Response) => {
	const { userId } = req.params;

	try {
		if (isNaN(parseInt(userId))) {
			throw new ErrorObj.ClientError("userId must be number");
		}

		const result = await userService.getUserDataById(userId);

		if (result === undefined) {
			throw new ErrorObj.ClientError("Customer not found!", 404);
		}

		res.status(200).json({
			status: "success",
			data: { customers: result }
		});
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
