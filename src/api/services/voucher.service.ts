// Data
import { voucherRepo } from "../data";

export const getAllVouchers = async (voucherStatus: string, sortBy: string) => {
	const vouchers = await voucherRepo.getAllVouchers(voucherStatus, sortBy);

	return vouchers;
};

export const getSingleVoucher = async (voucherCode: string) => {
	const { voucherResult, selectedUsers } = await voucherRepo.getSingleVoucher(voucherCode);

	return selectedUsers.length > 0
		? { ...voucherResult.rows[0], selectedUsers }
		: voucherResult.rows[0];
};

export const createVoucher = async (voucherData: any[], selectedUserIds: string[] | number[]) => {
	const newVoucher = await voucherRepo.createVoucher(voucherData, selectedUserIds);

	return newVoucher;
};

export const updateVoucher = async (
	updatedVoucherData: any[],
	selectedUserIds: string[] | number[],
	removedUserIds: string[] | number[],
	code: string
) => {
	const updatedVoucher = await voucherRepo.updateVoucher(
		updatedVoucherData,
		selectedUserIds,
		removedUserIds,
		code
	);

	return updatedVoucher;
};
