// Data
import { voucherRepo } from "../data";

export const getAllVouchers = async (voucherStatus: string, sortBy: string) => {
	try {
		const vouchers = await voucherRepo.getAllVouchers(voucherStatus, sortBy);

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

export const createVoucher = async (voucherData: any[], selectedUserIds: string[] | number[]) => {
	try {
		const newVoucher = await voucherRepo.createVoucher(voucherData, selectedUserIds);

		return newVoucher;
	} catch (error) {
		throw error;
	}
};

export const updateVoucher = async (
	updatedVoucherData: any[],
	selectedUserIds: string[] | number[],
	removedUserIds: string[] | number[],
	code: string
) => {
	try {
		const updatedVoucher = await voucherRepo.updateVoucher(
			updatedVoucherData,
			selectedUserIds,
			removedUserIds,
			code
		);

		return updatedVoucher;
	} catch (error) {
		throw error;
	}
};
