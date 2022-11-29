// Dependencies
import { Request, Response } from "express";

// Services
import { userService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const updateUserAccountDetails = async (req: Request, res: Response) => {
	const { full_name, contact, birth_date } = req.body;
	const userSub = req.auth?.sub;

	try {
		if (req.auth === undefined) {
			throw new ErrorObj.ServerError("Failed to check user authority, please try again.");
		}

		const updatedUserAccountDetailsData = [full_name, contact, birth_date];

		const result = await userService.updateUserAccountDetails(
			updatedUserAccountDetailsData,
			userSub
		);

		res.status(200).json({
			status: "success",
			data: { updatedAccountDetails: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const changeUserProfilePicture = async (req: Request, res: Response) => {
	const userEmail = req.user?.email;
	const userCurrentPicture = req.user?.profile_picture || "";

	try {
		const image = req.file as Express.Multer.File;

		if (userEmail === undefined) {
			throw new ErrorObj.ServerError("Failed to check user authority, please try again.");
		}

		const result = await userService.changeUserProfilePicture(image, userEmail, userCurrentPicture);

		res.status(200).json({
			status: "success",
			data: { updatedAccountDetails: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const deleteUserProfilePicture = async (req: Request, res: Response) => {
	const userEmail = req.user?.email;
	const userCurrentPicture = req.user?.profile_picture || "";

	try {
		if (userEmail === undefined) {
			throw new ErrorObj.ServerError("Failed to check user authority, please try again.");
		}

		const result = await userService.deleteUserProfilePicture(userEmail, userCurrentPicture);

		res.status(200).json({
			status: "success",
			data: { updatedAccountDetails: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
