// Mocks
import { mockErrorBody, mockAuth0User, mockPaginationData } from "./helpers/mockVariables";

const mockBrands = [
	{
		id: 1,
		name: "BRAND_1",
		identifier: "BRAND_1_ID",
		created_at: "2023-01-01T12:00:00.000Z",
		modified_at: "2023-01-01T12:00:00.000Z"
	},
	{
		id: 2,
		name: "BRAND_2",
		identifier: "BRAND_2_ID",
		created_at: "2023-01-01T12:00:00.000Z",
		modified_at: "2023-01-01T12:00:00.000Z"
	}
];

// Mock brandRepo
jest.mock("../../data/brand.data.ts", () => ({
	getAllBrands: jest.fn(),
	createBrand: jest.fn(),
	updateBrand: jest.fn(),
	deleteBrand: jest.fn()
}));

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

// Dependencies
import express, { Request, Response, NextFunction } from "express";
import supertest from "supertest";
import { Server } from "http";
import { isAuth, isAdmin, errorHandler } from "../../middlewares";
import { brandService } from "../../services";
import { brandRepo } from "../../data";

// Module to test
import brandRouter from "../../routes/brand.route";

describe("admin brand route", () => {
	const app = express();
	let server: Server;

	beforeAll(() => {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use("/admin/brands", isAuth, isAdmin, brandRouter, errorHandler);

		server = app.listen(6000);
	});

	afterAll(() => {
		server.close();
	});

	describe("GET /admin/brands", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid query", () => {
			it("should return 200 status code, brand and pagination data", async () => {
				// Mock getAllBrands DB to return brands with pagination data
				(brandRepo.getAllBrands as jest.Mock).mockResolvedValueOnce({
					...mockPaginationData,
					brands: mockBrands
				});

				const res = await supertest(app).get("/admin/brands").query({
					page: "1",
					q: "search_query",
					sortBy: "a-z"
				});

				// Assert DB method was called with expected args
				expect(brandRepo.getAllBrands).toHaveBeenCalledWith("1", "search_query", "a-z");

				// Assert response to be expected response
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					...mockPaginationData,
					data: {
						brands: mockBrands
					}
				});
			});
		});

		describe("given invalid query", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'page' query
				const res1 = await supertest(app).get("/admin/brands").query({
					page: "abc"
				});

				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'page'.",
            "status": "error",
          }
        `);

				// Invalid 'sortBy' query
				const res2 = await supertest(app).get("/admin/brands").query({
					sortBy: "invalid"
				});

				expect(res2.status).toBe(400);
				expect(res2.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "sortBy" must be one of [product_amount, a-z, z-a, id, ]",
            "status": "error",
          }
        `);
			});
		});

		describe("getAllBrands throw DB error", () => {
			it("should return 500 status code and server error", async () => {
				// Mock getAllBrands DB to throw error
				(brandRepo.getAllBrands as jest.Mock).mockRejectedValueOnce(new Error("DB Error!"));

				const res = await supertest(app).get("/admin/brands");

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	describe("POST /admin/brands", () => {
		describe("given valid new brand data", () => {
			it("should return 201 status code and new brand data", async () => {
				const newBrand = {
					name: "BRAND_NAME",
					identifier: "BRAND_IDENTIFIER"
				};

				// Mock createBrand DB
				(brandRepo.createBrand as jest.Mock).mockResolvedValueOnce(newBrand);

				const res = await supertest(app).post("/admin/brands").send(newBrand);

				expect(res.status).toBe(201);
				expect(res.body).toEqual({
					status: "success",
					data: { newBrand }
				});
			});
		});

		describe("given invalid body", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'identifier' body
				const res1 = await supertest(app).post("/admin/brands").send({
					name: "VALID_NAME",
					identifier: ""
				});

				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "identifier" is not allowed to be empty",
            "status": "error",
          }
        `);

				// Invalid 'name' body
				const res2 = await supertest(app).post("/admin/brands").send({
					name: "",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res2.status).toBe(400);
				expect(res2.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "name" is not allowed to be empty",
            "status": "error",
          }
        `);

				// Invalid 'name' and 'identifier' body
				const res3 = await supertest(app).post("/admin/brands").send({
					name: "",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res3.status).toBe(400);
				expect(res3.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "name" is not allowed to be empty",
            "status": "error",
          }
        `);
			});
		});

		describe("createBrand throw DB error", () => {
			it("should return 500 status code and server error", async () => {
				// Mock createBrand DB to throw error
				(brandRepo.createBrand as jest.Mock).mockRejectedValueOnce(new Error("DB Error!"));

				const res = await supertest(app).post("/admin/brands").send({
					name: "VALID_NAME",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	describe("PUT /admin/brands/:brandId", () => {
		describe("given valid updated brand data and brand id", () => {
			it("should return 200 status code and updated brand data", async () => {
				const updatedBrand = {
					name: "UPDATED_BRAND_NAME",
					identifier: "UPDATED_BRAND_IDENTIFIER"
				};

				// Mock updateBrand DB
				(brandRepo.updateBrand as jest.Mock).mockResolvedValueOnce(updatedBrand);

				const res = await supertest(app).put("/admin/brands/1").send(updatedBrand);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: { updatedBrand }
				});
			});
		});

		describe("given invalid body", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'identifier' body
				const res1 = await supertest(app).put("/admin/brands/1").send({
					name: "VALID_NAME",
					identifier: ""
				});

				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "identifier" is not allowed to be empty",
            "status": "error",
          }
        `);

				// Invalid 'name' body
				const res2 = await supertest(app).put("/admin/brands/1").send({
					name: "",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res2.status).toBe(400);
				expect(res2.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "name" is not allowed to be empty",
            "status": "error",
          }
        `);

				// Invalid 'name' and 'identifier' body
				const res3 = await supertest(app).put("/admin/brands/1").send({
					name: "",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res3.status).toBe(400);
				expect(res3.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "name" is not allowed to be empty",
            "status": "error",
          }
        `);
			});
		});

		describe("given invalid brand id params", () => {
			it("should return 400 status and validation error message", async () => {
				const res = await supertest(app).put("/admin/brands/a").send({
					name: "VALID_NAME",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
        {
          "message": "Validation error: Please provide a valid 'brandId'.",
          "status": "error",
        }
      `);
			});
		});

		describe("updateBrand throw DB error", () => {
			it("should return 500 status code and server error", async () => {
				// Mock updateBrand DB to throw error
				(brandRepo.updateBrand as jest.Mock).mockRejectedValueOnce(new Error("DB Error!"));

				const res = await supertest(app).put("/admin/brands/1").send({
					name: "VALID_NAME",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	describe("DELETE /admin/brands/:brandId", () => {
		describe("given valid brand id params", () => {
			it("should return 200 status code and deleted brand", async () => {
				const deletedBrand = {
					id: 1,
					name: "BRAND_NAME",
					identifier: "BRAND_IDENTIFIER"
				};

				(brandRepo.deleteBrand as jest.Mock).mockResolvedValueOnce(deletedBrand);

				const res = await supertest(app).delete("/admin/brands/1");

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						deletedBrand
					}
				});
			});
		});

		describe("given invalid brand id params", () => {
			it("should return 400 status code and validation error message", async () => {
				const res = await supertest(app).delete("/admin/brands/invalid");

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'brandId'.",
            "status": "error",
          }
        `);
			});
		});
	});
});
