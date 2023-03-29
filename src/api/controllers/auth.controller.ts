// Dependencies
import { Response, Request, NextFunction } from "express";

// Utils
import { ErrorObj } from "../utils";

// Services
import { userService, authService } from "../services";

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken = req.headers.authorization?.split(" ")[1];
		const auth0UserData = await authService.getUserInfoAuth0(accessToken!);

		// Throw unathorizaed error
		if (auth0UserData === undefined) {
			throw new ErrorObj.ClientError("Failed to authenticate user!", 401);
		}

		// Create user if user doesn't exist in DB
		let userData = await userService.getUserDataByEmail(auth0UserData.email);

		if (userData === undefined) {
			userData = await userService.createNewUser([
				auth0UserData.name,
				auth0UserData.email,
				auth0UserData.picture,
				auth0UserData.sub
			]);
		}
		res.status(200).json({
			status: "success",
			data: { user: userData }
		});
	} catch (error: any) {
		if (error.status === 401) {
			return res.status(401).json({
				status: "error",
				message: error.message
			});
		}

		return next(error);
	}
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	const userEmail = req.user?.email;

	try {
		if (userEmail === undefined) {
			throw new ErrorObj.ServerError("Failed to check user authority, please try again.");
		}

		const result = await authService.resetPasswordAuth0(userEmail);

		res.status(200).json({
			status: "success",
			data: { result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
