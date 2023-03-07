// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { voucherService } from "../../services/client";

// Utils
import { ErrorObj } from "../../utils";

// Types

export const getUserVouchers = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	try {
		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const result = await voucherService.getUserVouchers(userId);

		res.status(200).json({
			status: "success",
			data: { vouchers: result.rows }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const getSingleVoucher = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;
	const { voucherCode } = req.params;

	try {
		if (typeof voucherCode !== "string") {
			throw new ErrorObj.ClientError("Query param 'voucherCode' has to be type of string");
		}

		if (voucherCode?.length !== 10) throw new ErrorObj.ClientError("Invalid voucher code!");

		if (!userId) {
			throw new ErrorObj.ClientError("Failed to identity user!");
		}

		const result = await voucherService.getSingleVoucher(voucherCode, userId);

		res.status(200).json({
			status: "success",
			data: { voucher: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
