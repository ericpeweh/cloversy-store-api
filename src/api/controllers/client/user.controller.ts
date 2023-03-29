// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { userService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

export const updateUserAccountDetails = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { full_name, contact, birth_date } = req.body;
		const userSub = req.auth?.sub;

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
			data: { updatedAccountDetails: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const changeUserProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
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
			data: { updatedAccountDetails: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const deleteUserProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
	const userEmail = req.user?.email;
	const userCurrentPicture = req.user?.profile_picture || "";

	try {
		if (userEmail === undefined) {
			throw new ErrorObj.ServerError("Failed to check user authority, please try again.");
		}

		const result = await userService.deleteUserProfilePicture(userEmail, userCurrentPicture);

		res.status(200).json({
			status: "success",
			data: { updatedAccountDetails: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
