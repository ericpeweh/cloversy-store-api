// Data
import { voucherRepo } from "../../data/client";

export const getUserVouchers = async (userId: string) => {
	try {
		const vouchers = await voucherRepo.getUserVouchers(userId);

		return vouchers;
	} catch (error) {
		throw error;
	}
};

export const getSingleVoucher = async (voucherCode: string) => {
	try {
		const { voucherResult, selectedUsers } = await voucherRepo.getSingleVoucher(voucherCode);

		return selectedUsers.length > 0
			? { ...voucherResult.rows[0], selectedUsers }
			: voucherResult.rows[0];
	} catch (error) {
		throw error;
	}
};
