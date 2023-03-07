// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { voucherService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getAllVouchers = async (req: Request, res: Response, next: NextFunction) => {
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

		const { vouchers, ...paginationData } = await voucherService.getAllVouchers(
			voucherStatus,
			sortBy,
			page,
			itemsLimit
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
		if (typeof voucherCode !== "string" || typeof analyticYear !== "string") {
			throw new ErrorObj.ClientError("Query param has to be type of string");
		}

		let yearFilter = analyticYear;
		if (!analyticYear) {
			yearFilter = new Date().getFullYear().toString();
		}

		const result = await voucherService.getSingleVoucher(voucherCode, yearFilter);

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
