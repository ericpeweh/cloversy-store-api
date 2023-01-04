// Dependencies
import { Request, Response } from "express";

// Services
import { voucherService } from "../services";
import { ErrorObj } from "../utils";

// Types

export const getAllVouchers = async (req: Request, res: Response) => {
	const {
		status: voucherStatus = "",
		sortBy = "",
		page = "",
		limit: itemsLimit = "10"
	} = req.query;

	try {
		if (
			typeof voucherStatus !== "string" ||
			typeof sortBy !== "string" ||
			typeof page !== "string" ||
			typeof itemsLimit !== "string"
		) {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (!["", "active", "disabled"].includes(voucherStatus)) {
			throw new ErrorObj.ClientError(
				`Query params 'status' of '${voucherStatus}' is not supported`
			);
		}

		if (!["current_usage", "latest", "expiry_date", "id", ""].includes(sortBy)) {
			throw new ErrorObj.ClientError(`Query params 'sortBy' of '${sortBy}' is not supported`);
		}

		const result = await voucherService.getAllVouchers(voucherStatus, sortBy, page, itemsLimit);

		res.status(200).json({
			status: "success",
			data: result
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
			expiry_date = null,
			status,
			discount,
			discount_type,
			voucher_scope,
			description,
			selectedUserIds = []
		} = req.body;

		const voucherQueryData = [
			code,
			title,
			expiry_date,
			discount,
			discount_type,
			status,
			voucher_scope,
			description
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
	const { voucherCode } = req.params;

	try {
		const {
			title,
			status,
			expiry_date,
			discount,
			discount_type,
			voucher_scope,
			description,
			selectedUserIds = [],
			removedUserIds = []
		} = req.body;

		const voucherQueryData = [
			title,
			expiry_date,
			discount,
			discount_type,
			status,
			voucher_scope,
			description
		];

		const result = await voucherService.updateVoucher(
			voucherQueryData,
			selectedUserIds,
			removedUserIds,
			voucherCode
		);

		res.status(200).json({
			status: "success",
			data: { updatedVoucher: result.rows[0] }
		});
	} catch (error: any) {
		res.status(400).json({
			status: "error",
			message: error.message
		});
	}
};
