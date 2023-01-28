// Dependencies
import { Request, Response } from "express";

// Services
import { dashboardService } from "../services";

// Utils
import { ErrorObj } from "../utils";

export const getDashboardData = async (req: Request, res: Response) => {
	const {
		sales_analytic_year: salesAnalyticYear = "",
		visitor_analytic_year: visitorAnalyticYear = ""
	} = req.query;

	try {
		if (typeof salesAnalyticYear !== "string" || typeof visitorAnalyticYear !== "string") {
			throw new ErrorObj.ClientError("Query params has to be type of string");
		}

		if (
			salesAnalyticYear &&
			salesAnalyticYear.length !== 4 &&
			visitorAnalyticYear &&
			visitorAnalyticYear.length !== 4
		) {
			throw new ErrorObj.ClientError(`Invalid query params`);
		}

		let salesYearFilter = salesAnalyticYear;
		if (!salesAnalyticYear) {
			salesYearFilter = new Date().getFullYear().toString();
		}

		let visitorYearFilter = visitorAnalyticYear;
		if (!visitorAnalyticYear) {
			visitorYearFilter = new Date().getFullYear().toString();
		}

		const result = await dashboardService.getDashboardData(salesYearFilter, visitorYearFilter);

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
