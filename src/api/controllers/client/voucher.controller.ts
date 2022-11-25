// Dependencies
import { Request, Response } from "express";

// Services
import { voucherService } from "../../services/client";
import { ErrorObj } from "../../utils";

// Types

export const getUserVouchers = async (req: Request, res: Response) => {
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
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};

export const getSingleVoucher = async (req: Request, res: Response) => {
	const { voucherCode } = req.params;

	try {
		if (typeof voucherCode !== "string") {
			throw new ErrorObj.ClientError("Query param 'voucherCode' has to be type of string");
		}

		const result = await voucherService.getSingleVoucher(voucherCode);

		res.status(200).json({
			status: "success",
			data: { voucher: result }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
