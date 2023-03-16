// Mocks
import { mockErrorBody, mockAuth0User, mockPaginationData } from "./helpers/mockVariables";

const mockCategories = [
	{
		id: 1,
		name: "CATEGORY_1",
		description: "CAT_1_DESC",
		identifier: "CATEGORY_1_ID",
		created_at: "2023-01-01T12:00:00.000Z",
		modified_at: "2023-01-01T12:00:00.000Z"
	},
	{
		id: 2,
		name: "CATEGORY_2",
		description: "CAT_2_DESC",
		identifier: "CATEGORY_2_ID",
		created_at: "2023-01-01T12:00:00.000Z",
		modified_at: "2023-01-01T12:00:00.000Z"
	}
];

// Mock categoryRepo
jest.mock("../../data/category.data.ts", () => ({
	getAllCategories: jest.fn(),
	createCategory: jest.fn(),
	updateCategory: jest.fn(),
	deleteCategory: jest.fn()
}));

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
import { categoryRepo } from "../../data";

// Module to test
import categoryRouter from "../../routes/category.route";

describe("admin category route", () => {
	const app = express();
	let server: Server;

	beforeAll(() => {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use("/admin/category", isAuth, isAdmin, categoryRouter, errorHandler);

		server = app.listen();
	});

	afterAll(() => {
		server.close();
	});

	describe("GET /admin/category", () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		describe("given valid query", () => {
			it("should return 200 status code, categories and pagination data", async () => {
				// Mock getAllCategories DB to return categories with pagination data
				(categoryRepo.getAllCategories as jest.Mock).mockResolvedValueOnce({
					...mockPaginationData,
					categories: mockCategories
				});

				const res = await supertest(app).get("/admin/category").query({
					page: "1",
					q: "search_query",
					sortBy: "a-z"
				});

				// Assert DB method was called with expected args
				expect(categoryRepo.getAllCategories).toHaveBeenCalledWith("1", "search_query", "a-z");

				// Assert response to be expected response
				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					...mockPaginationData,
					data: {
						categories: mockCategories
					}
				});
			});
		});

		describe("given invalid query", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'page' query
				const res1 = await supertest(app).get("/admin/category").query({
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
				const res2 = await supertest(app).get("/admin/category").query({
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

		describe("getAllCategories throw DB error", () => {
			it("should return 500 status code and server error", async () => {
				// Mock getAllCategories DB to throw error
				(categoryRepo.getAllCategories as jest.Mock).mockRejectedValueOnce(new Error("DB Error!"));

				const res = await supertest(app).get("/admin/category");

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	describe("POST /admin/category", () => {
		describe("given valid new category data", () => {
			it("should return 201 status code and new category data", async () => {
				const newCategory = {
					name: "CATEGORY_NAME",
					description: "CATEGORY_DESC",
					identifier: "CATEGORY_IDENTIFIER"
				};

				// Mock createCategory DB
				(categoryRepo.createCategory as jest.Mock).mockResolvedValueOnce(newCategory);

				const res = await supertest(app).post("/admin/category").send(newCategory);

				expect(res.status).toBe(201);
				expect(res.body).toEqual({
					status: "success",
					data: { newCategory }
				});
			});
		});

		describe("given invalid body", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'identifier' body
				const res1 = await supertest(app).post("/admin/category").send({
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
				const res2 = await supertest(app).post("/admin/category").send({
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
				const res3 = await supertest(app).post("/admin/category").send({
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

		describe("createCategory throw DB error", () => {
			it("should return 500 status code and server error", async () => {
				// Mock createCategory DB to throw error
				(categoryRepo.createCategory as jest.Mock).mockRejectedValueOnce(new Error("DB Error!"));

				const res = await supertest(app).post("/admin/category").send({
					name: "VALID_NAME",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	describe("PUT /admin/category/:categoryId", () => {
		describe("given valid updated category data and category id", () => {
			it("should return 200 status code and updated category data", async () => {
				const updatedCategory = {
					name: "UPDATED_CATEGORY_NAME",
					identifier: "UPDATED_CATEGORY_IDENTIFIER",
					description: "UPDATED_CATEGORY_DESC"
				};

				// Mock updateCategory DB
				(categoryRepo.updateCategory as jest.Mock).mockResolvedValueOnce(updatedCategory);

				const res = await supertest(app).put("/admin/category/1").send(updatedCategory);

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: { updatedCategory }
				});
			});
		});

		describe("given invalid body", () => {
			it("should return 400 status code and validation error message", async () => {
				// Invalid 'identifier' body
				const res1 = await supertest(app).put("/admin/category/1").send({
					name: "VALID_NAME",
					identifier: ""
					// No 'description' provided because description is optional
				});

				expect(res1.status).toBe(400);
				expect(res1.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: "identifier" is not allowed to be empty",
            "status": "error",
          }
        `);

				// Invalid 'name' body
				const res2 = await supertest(app).put("/admin/category/1").send({
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
				const res3 = await supertest(app).put("/admin/category/1").send({
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

		describe("given invalid category id params", () => {
			it("should return 400 status and validation error message", async () => {
				const res = await supertest(app).put("/admin/category/a").send({
					name: "VALID_NAME",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
        {
          "message": "Validation error: Please provide a valid 'categoryId'.",
          "status": "error",
        }
      `);
			});
		});

		describe("updateCategory throw DB error", () => {
			it("should return 500 status code and server error", async () => {
				// Mock updateCategory DB to throw error
				(categoryRepo.updateCategory as jest.Mock).mockRejectedValueOnce(new Error("DB Error!"));

				const res = await supertest(app).put("/admin/category/1").send({
					name: "VALID_NAME",
					identifier: "VALID_IDENTIFIER"
				});

				expect(res.status).toBe(500);
				expect(res.body).toEqual(mockErrorBody);
			});
		});
	});

	describe("DELETE /admin/category/:categoryid", () => {
		describe("given valid category id params", () => {
			it("should return 200 status code and deleted category", async () => {
				const deletedCategory = {
					id: 1,
					name: "CATEGORY_NAME",
					identifier: "CATEGORY_IDENTIFIER",
					description: "CATEGORY_DESC"
				};

				(categoryRepo.deleteCategory as jest.Mock).mockResolvedValueOnce(deletedCategory);

				const res = await supertest(app).delete("/admin/category/1");

				expect(res.status).toBe(200);
				expect(res.body).toEqual({
					status: "success",
					data: {
						deletedCategory
					}
				});
			});
		});

		describe("given invalid category id params", () => {
			it("should return 400 status code and validation error message", async () => {
				const res = await supertest(app).delete("/admin/category/invalid");

				expect(res.status).toBe(400);
				expect(res.body).toMatchInlineSnapshot(`
          {
            "message": "Validation error: Please provide a valid 'categoryId'.",
            "status": "error",
          }
        `);
			});
		});
	});
});
