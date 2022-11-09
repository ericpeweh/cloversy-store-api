// Data
import { userRepo } from "../data";

export const getUserData = async (userEmail: string) => {
	const userData = await userRepo.getUserData(userEmail);

	return userData.rows[0];
};

export const createNewUser = async (userData: any[]) => {
	const newUser = await userRepo.createNewUser(userData);

	return newUser.rows[0];
};
