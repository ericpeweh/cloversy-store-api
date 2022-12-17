// Data
import { voucherRepo } from "../../data/client";

// Utils
import { ErrorObj } from "../../utils";
import isDateSurpassToday from "../../utils/isDateSurpassToday";

export const getUserVouchers = async (userId: string) => {
	try {
		const vouchers = await voucherRepo.getUserVouchers(userId);

		return vouchers;
	} catch (error) {
		throw error;
	}
};

export const getSingleVoucher = async (voucherCode: string, userId: string) => {
	try {
		const { voucherResult, selectedUsers } = await voucherRepo.getSingleVoucher(
			voucherCode.toUpperCase()
		);
		const isVoucherUserScoped = selectedUsers.length > 0;
		const voucher = voucherResult.rows[0];

		if (isVoucherUserScoped) {
			const isUserIncluded = selectedUsers.findIndex(user => user.user_id === userId) !== -1;

			if (!isUserIncluded)
				throw new ErrorObj.ClientError("You're not authorized to use this voucher!", 403);
		}

		if (voucher.status !== "active") {
			throw new ErrorObj.ClientError("Voucher is no longer available.");
		}

		if (isDateSurpassToday(voucher.expiry_date)) {
			throw new ErrorObj.ClientError("Voucher is expired.");
		}

		if (voucher.current_usage >= voucher.usage_limit) {
			throw new ErrorObj.ClientError("Voucher usage limit has been reached.");
		}

		return voucher;
	} catch (error) {
		throw error;
	}
};
