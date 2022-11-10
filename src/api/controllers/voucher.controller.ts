// Dependencies
import { Request, Response } from "express";

// Services
import { voucherService } from "../services";

// Types

export const createVoucher = async (req: Request, res: Response) => {
	try {
		const {
			code,
			title,
			expiryDate = null,
			discount,
			discountType,
			status,
			selectedUserIds = []
		} = req.body;

		const voucherQueryData = [code, title, expiryDate, discount, discountType, status];

		const result = await voucherService.createVoucher(voucherQueryData, selectedUserIds);

		res.status(200).json({
			status: "success",
			data: { newVoucher: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
