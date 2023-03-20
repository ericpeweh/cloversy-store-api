// Mocks
import { mockErrorBody, mockAuth0User, mockDashboardData } from "./helpers/mockVariables";

// Mock middlewares
jest.mock("../../middlewares", () => ({
	...jest.requireActual("../../middlewares"),
	isAuth: jest.fn((req: Request, _: Response, next: NextFunction) => {
		req.auth = mockAuth0User;
		return next();
	}),
	isAdmin: jest.fn((_1: Request, _2: Response, next: NextFunction) => {
		return next();
	})
}));

// Mock admin repo DB access
jest.mock("../../data", () => ({
	transactionRepo: {
		getSalesTotal: jest.fn().mockResolvedValue(mockDashboardData.salesTotal),
		getTransactionCount: jest.fn().mockResolvedValue(mockDashboardData.transactionCount),
		getMonthlySalesCountAnalytics: jest.fn().mockResolvedValue(mockDashboardData.monthlySalesCount)
	},
	productRepo: {
		getProductCount: jest.fn().mockResolvedValue(mockDashboardData.productCount)
	},
	userRepo: {
		getCustomerCount: jest.fn().mockResolvedValue(mockDashboardData.customerCount)
	},
	reviewRepo: {
		getReviewCount: jest.fn().mockResolvedValue(mockDashboardData.reviewCount)
	},
	voucherRepo: {
		getActiveVoucherCount: jest.fn().mockResolvedValue(mockDashboardData.activeVoucherCount)
	}
}));

// Mock admin service
jest.mock("../../services", () => ({
	...jest.requireActual("../../services"),
	analyticsService: {
		getAppMonthlyVisitorAnalytics: jest
			.fn()
			.mockResolvedValue(mockDashboardData.monthlyVisitorCount)
	}
}));

// Dependencies
import express, { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import { isAuth, isAdmin, errorHandler } from "../../middlewares";
import { Server } from "http";
import { dashboardService } from "../../services";

// Module to test
import dashboardRouter from "../../routes/dashboard.route";

describe("admin dashboard route", () => {
	const app = express();
	let server: Server;

	beforeAll(() => {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use("/admin", isAuth, isAdmin, dashboardRouter, errorHandler);

		server = app.listen();
	});

	afterAll(() => {
		server.close();
	});

	describe("GET /admin", () => {
		describe("given valid request query", () => {
			it("should return 200 status code and dashboard data", async () => {
				const res = await supertest(app).get("/admin").query({
					sales_analytic_year: "2023",
					visitor_analytic_year: "2023"
				});

				expect(res.status).toBe(200);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "data": {
              "activeVoucherCount": 10,
              "analytics": [
                {
                  "app_views": "35",
                  "month": "Jan",
                  "product_sales": 10,
                },
                {
                  "app_views": "1525",
                  "month": "Feb",
                  "product_sales": 15,
                },
                {
                  "app_views": "641",
                  "month": "Mar",
                  "product_sales": 5,
                },
                {
                  "app_views": "0",
                  "month": "Apr",
                  "product_sales": 8,
                },
                {
                  "app_views": "0",
                  "month": "May",
                  "product_sales": 7,
                },
                {
                  "app_views": "0",
                  "month": "Jun",
                  "product_sales": 9,
                },
                {
                  "app_views": "0",
                  "month": "Jul",
                  "product_sales": 20,
                },
                {
                  "app_views": "0",
                  "month": "Aug",
                  "product_sales": 18,
                },
                {
                  "app_views": "0",
                  "month": "Sep",
                  "product_sales": 23,
                },
                {
                  "app_views": "0",
                  "month": "Oct",
                  "product_sales": 6,
                },
                {
                  "app_views": "0",
                  "month": "Nov",
                  "product_sales": 13,
                },
              ],
              "customerCount": 4000,
              "productCount": 200,
              "reviewCount": 500,
              "salesTotal": 10000,
              "transactionCount": 1000,
            },
            "status": "success",
          }
        `);
			});
		});

		describe("given invalid analytic year queries", () => {
			it("should return 400 status code and validation error message", async () => {
				const res = await supertest(app).get("/admin").query({
					sales_analytic_year: "invalid", // should be number
					visitor_analytic_year: "500" // invalid year (< 1000)
				});

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Invalid 'sales_analytic_year' query param. Please provide a valid year.",
            "status": "error",
          }
        `);
			});
		});

		describe("dashboard service throws error", () => {
			it("should return 500 status code and server error message", async () => {
				// Mock getDashboardData service to throw error
				jest
					.spyOn(dashboardService, "getDashboardData")
					.mockRejectedValueOnce(new Error("DB / Service Error!"));

				const res = await supertest(app).get("/admin");

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);

				// Restore to original implementation
				(dashboardService.getDashboardData as jest.Mock).mockRestore();
			});
		});
	});
});
