// Dependencies
import fs from "fs";

// Data
import { userRepo } from "../../data/client";

// Config
import bucket from "../../../config/cloudStorage";

export const updateUserAccountDetails = async (
	updatedUserAccountDetailsData: string[],
	userSub: string
) => {
	const userData = await userRepo.updateUserAccountDetails(updatedUserAccountDetailsData, userSub);

	return { ...userData, contact: userData.user_contact };
};

export const changeUserProfilePicture = async (
	image: Express.Multer.File,
	userEmail: string,
	userCurrentPicture: string
) => {
	if (!userCurrentPicture.includes("s.gravatar.com") && userCurrentPicture) {
		await bucket
			.file(userCurrentPicture.replace("https://storage.googleapis.com/cloversy-store/", ""))
			.delete()
			.catch(); // prevent throw remove image (fallback if image is already deleted)
	}

	const cloudImageResponse = await bucket.upload(image.path, {
		destination: `users/user-${userEmail}-${image.filename}.jpeg`
	});

	const userData = await userRepo.changeUserProfilePicture(userEmail, cloudImageResponse);

	fs.unlink(image.path, () => {});

	return userData;
};

export const deleteUserProfilePicture = async (userEmail: string, userCurrentPicture: string) => {
	if (!userCurrentPicture.includes("s.gravatar.com") && userCurrentPicture) {
		await bucket
			.file(userCurrentPicture.replace("https://storage.googleapis.com/cloversy-store/", ""))
			.delete();
	}

	const userData = await userRepo.deleteUserProfilePicture(userEmail);

	return userData;
};
