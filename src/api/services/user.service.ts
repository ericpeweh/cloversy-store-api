// Data
import { userRepo } from "../data";

// Types
import { User, UserStatus } from "../interfaces";

// Utils
import getLocalTime from "../utils/getLocalTime";

export const getAllCustomers = async (page: string, searchQuery: string, statusQuery: string) => {
	const customers = await userRepo.getAllCustomers(page, searchQuery, statusQuery);

	return customers;
};

export const getUserDataByEmail = async (userEmail: string) => {
	const userData = await userRepo.getUserDataByEmail(userEmail);

	return userData.rows[0];
};

export const getUserDataBySub = async (userSub: string) => {
	const userData = await userRepo.getUserDataBySub(userSub);

	return userData.rows[0];
};

export const getUserDataById = async (userId: string) => {
	const userData = await userRepo.getUserDataById(userId);

	return {
		...userData.userResult.rows[0],
		address: userData.addressResult.rows,
		lastSeen: userData.lastSeenResult.rows,
		wishlist: userData.wishlistResult.rows,
		vouchers: userData.vouchersResult.rows
	};
};

export const createNewUser = async (userData: any[]) => {
	const newUser = await userRepo.createNewUser(userData);

	return newUser.rows[0];
};

export const updateUser = async (
	updatedUserData: Partial<User>,
	userId: string,
	prev_status: UserStatus
) => {
	// User status case
	if (prev_status === "banned" && updatedUserData.user_status === "active") {
		updatedUserData.banned_date = null;
	}

	if (prev_status === "active" && updatedUserData.user_status === "banned") {
		updatedUserData.banned_date = getLocalTime();
	}

	const userResult = await userRepo.updateUser(updatedUserData, userId);

	return userResult.rows[0];
};
