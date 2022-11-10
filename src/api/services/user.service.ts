// Data
import { userRepo } from "../data";

export const getUserDataByEmail = async (userEmail: string) => {
	const userData = await userRepo.getUserDataByEmail(userEmail);

	return userData.rows[0];
};

export const getUserDataById = async (userId: string) => {
	const userData = await userRepo.getUserDataById(userId);

	return userData.rows[0];
};

export const createNewUser = async (userData: any[]) => {
	const newUser = await userRepo.createNewUser(userData);

	return newUser.rows[0];
};

export const getAllCustomers = async (searchQuery: string, statusQuery: string) => {
	const customers = await userRepo.getAllCustomers(searchQuery, statusQuery);

	return customers;
};
