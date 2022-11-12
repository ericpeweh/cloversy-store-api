// Dependencies
import { Request, Response } from "express";

// Services
import { voucherService } from "../services";
import { ErrorObj } from "../utils";

// Types

export const getAllVouchers = async (req: Request, res: Response) => {
	const { status: voucherStatus = "", sortBy = "" } = req.query;

	try {
		if (typeof voucherStatus !== "string" || typeof sortBy !== "string") {
			throw new ErrorObj.ClientError("Query param 'status' and 'sortBy' has to be type of string");
		}

		if (!["current_usage", "latest", "expiry_date", ""].includes(sortBy)) {
			throw new ErrorObj.ClientError("Query param 'sortBy' is not supported");
		}

		const result = await voucherService.getAllVouchers(voucherStatus, sortBy);

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

export const createVoucher = async (req: Request, res: Response) => {
	try {
		const {
			code,
			title,
			expiryDate = null,
			status,
			discount,
			discountType,
			voucherScope,
			selectedUserIds = []
		} = req.body;

		const voucherQueryData = [
			code,
			title,
			expiryDate,
			discount,
			discountType,
			status,
			voucherScope
		];

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

export const updateVoucher = async (req: Request, res: Response) => {
	try {
		const {
			code,
			title,
			status,
			expiryDate,
			discount,
			discountType,
			voucherScope,
			selectedUserIds = [],
			removedUserIds = []
		} = req.body;

		const voucherQueryData = [title, expiryDate, discount, discountType, status, voucherScope];

		const result = await voucherService.updateVoucher(
			voucherQueryData,
			selectedUserIds,
			removedUserIds,
			code
		);

		res.status(200).json({
			status: "success",
			data: { updatedVoucher: result.rows[0] }
		});
	} catch (error: any) {
		console.log(error);

		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
