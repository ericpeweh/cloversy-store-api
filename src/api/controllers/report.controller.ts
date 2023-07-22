// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { reportService } from "../services";

// Utils
import { validateReportDate, ErrorObj } from "../utils";

export const getSalesReport = async (req: Request, res: Response, next: NextFunction) => {
	const { startDate, endDate } = req.query;

	try {
		// Extra validation for date
		if (
			validateReportDate(startDate as string) === false ||
			validateReportDate(endDate as string) === false
		) {
			throw new ErrorObj.ClientError("Invalid date range params!");
		}

		const reports = await reportService.getSalesReport(startDate as string, endDate as string);

		res.status(200).json({
			status: "success",
			data: { reports }
		});
	} catch (error: unknown) {
		return next(error);
	}
};
