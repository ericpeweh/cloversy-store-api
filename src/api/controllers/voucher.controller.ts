// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { voucherService } from "../services";

export const getAllVouchers = async (req: Request, res: Response, next: NextFunction) => {
	const {
		status: voucherStatus = "",
		sortBy = "",
		page = "",
		limit: itemsLimit = "10"
	} = req.query;

	try {
		const { vouchers, ...paginationData } = await voucherService.getAllVouchers(
			voucherStatus as string,
			sortBy as string,
			page as string,
			itemsLimit as string
		);

		res.status(200).json({
			status: "success",
			...paginationData,
			data: { vouchers }
		});
	} catch (error: unknown) {
		console.log(error);

		return next(error);
	}
};

export const getSingleVoucher = async (req: Request, res: Response, next: NextFunction) => {
	const { voucherCode } = req.params;
	const { analytic_year: analyticYear = "" } = req.query;

	try {
		let yearFilter = analyticYear;
		if (!analyticYear) {
			yearFilter = new Date().getFullYear().toString();
		}

		const result = await voucherService.getSingleVoucher(voucherCode, yearFilter as string);

		res.status(200).json({
			status: "success",
			data: { voucher: result }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const createVoucher = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			code,
			title,
			expiry_date = null,
			status,
			usage_limit = 10,
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
			usage_limit,
			voucher_scope,
			description
		];

		const result = await voucherService.createVoucher(voucherQueryData, selectedUserIds);

		res.status(200).json({
			status: "success",
			data: { newVoucher: result.rows[0] }
		});
	} catch (error: unknown) {
		return next(error);
	}
};

export const updateVoucher = async (req: Request, res: Response, next: NextFunction) => {
	const { voucherCode } = req.params;

	try {
		const {
			title,
			status,
			usage_limit,
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
			usage_limit,
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
	} catch (error: unknown) {
		return next(error);
	}
};
