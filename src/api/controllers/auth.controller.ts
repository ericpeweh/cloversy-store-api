// Dependencies
import { Response, Request } from "express";
import axios from "axios";

// Utils
import { ErrorObj } from "../utils";

// Services
import { userService, authService } from "../services";

export const authUser = async (req: Request, res: Response) => {
	try {
		const accessToken = req.headers.authorization?.split(" ")[1];
		const auth0UserData = await authService.getUserInfoAuth0(accessToken!);
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
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};

export const resetPassword = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(error.statusCode || 500).json({
			status: "error",
			message: error.message
		});
	}
};
