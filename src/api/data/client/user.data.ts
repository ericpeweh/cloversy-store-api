// Config
import db from "../../../config/connectDB";

// Types
import { UploadResponse } from "@google-cloud/storage";

export const updateUserAccountDetails = async (
	updatedUserAccountDetailsData: string[],
	userSub: string
) => {
	const userQuery = `UPDATE users 
    SET full_name = $1, user_contact = $2, birth_date = $3
    WHERE sub = $4
    RETURNING *
  `;
	const userResult = await db.query(userQuery, [...updatedUserAccountDetailsData, userSub]);

	return userResult.rows[0];
};

export const changeUserProfilePicture = async (
	userEmail: string,
	cloudImageResponse: UploadResponse
) => {
	const imageQuery = `UPDATE users
    SET profile_picture = $1
    WHERE email = $2
    RETURNING *
  `;

	const userData = await db.query(imageQuery, [
		`https://storage.googleapis.com/cloversy-store/${cloudImageResponse[1].name}`,
		userEmail
	]);

	return userData.rows[0];
};

export const deleteUserProfilePicture = async (userEmail: string) => {
	const imageQuery = `UPDATE users
    SET profile_picture = NULL
    WHERE email = $1
    RETURNING *
  `;

	const userData = await db.query(imageQuery, [userEmail]);

	return userData.rows[0];
};
