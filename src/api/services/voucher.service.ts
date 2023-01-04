// Data
import { voucherRepo } from "../data";

export const getAllVouchers = async (
	voucherStatus: string,
	sortBy: string,
	page: string,
	itemsLimit: string
) => {
	try {
		const result = await voucherRepo.getAllVouchers(voucherStatus, sortBy, page, itemsLimit);

		return result;
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

export const getVoucherItem = async (voucherCode: string) => {
	const voucher = await voucherRepo.getVoucherItem(voucherCode);

	return voucher;
};
