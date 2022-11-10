// Data
import { voucherRepo } from "../data";

export const createVoucher = async (voucherData: any[], selectedUserIds: string[] | number[]) => {
	const newVoucher = await voucherRepo.createVoucher(voucherData, selectedUserIds);

	return newVoucher;
};
