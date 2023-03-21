// Dependencies
import { Request, Response, NextFunction } from "express";

// Services
import { dashboardService } from "../services";

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
	const {
		sales_analytic_year: salesAnalyticYear = "",
		visitor_analytic_year: visitorAnalyticYear = ""
	} = req.query;

	try {
		let salesYearFilter = salesAnalyticYear;
		if (!salesAnalyticYear) {
			salesYearFilter = new Date().getFullYear().toString();
		}

		let visitorYearFilter = visitorAnalyticYear;
		if (!visitorAnalyticYear) {
			visitorYearFilter = new Date().getFullYear().toString();
		}

		const result = await dashboardService.getDashboardData(
			salesYearFilter as string,
			visitorYearFilter as string
		);

		res.status(200).json({
			status: "success",
			data: result
		});
	} catch (error: unknown) {
		return next(error);
	}
};
