// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { userService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
	const { page = "1", q: searchQuery = "", status: statusQuery = "" } = req.query;

	try {
		if (
			typeof searchQuery !== "string" ||
			typeof statusQuery !== "string" ||
			typeof page !== "string"
		) {
			throw new ErrorObj.ClientError(
				"Query param 'page', 'q' and 'status' has to be type of string"
			);
		}

		const { customers, ...paginationData } = await userService.getAllCustomers(
			page,
			searchQuery,
			statusQuery
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { customers: customers.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getSingleCustomer = async (req: Request, res: Response, next: NextFunction) => {
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
			data: { customer: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getSingleCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
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
			data: { customer: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;
	const { full_name, contact, profile_picture, user_status, credits, prev_status } = req.body;

	try {
		const updatedUserData = {
			full_name,
			contact,
			profile_picture,
			user_status,
			credits
		};

		const result = await userService.updateUser(updatedUserData, userId, prev_status);

		res.status(200).json({
			status: "success",
			data: { updatedCustomer: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
