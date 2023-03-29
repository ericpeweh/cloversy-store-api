// Dependencies
import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import errorHandler from "../errorHandler";
import { UnauthorizedError } from "express-jwt";
import { ClientError, ServerError } from "../../utils/errorClass";

const app = express();

describe("errorHandler", () => {
	// Clear route "/" after each test run
	afterEach(() => {
		app._router.stack = app._router.stack.filter(
			(middleware: { route: { path: string } }) => middleware.route?.path !== "/"
		);
	});

	it("should handle UnauthorizedError - expressJwt", async () => {
		app.get(
			"/",
			(_1: Request, _2: Response, next: NextFunction) => {
				const error = new UnauthorizedError("invalid_token", {
					message: "Unauthorized error message"
				});
				return next(error);
			},
			errorHandler
		);

		const response = await request(app).get("/");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			status: "error",
			message: "Failed to authenticate / authorize on requested resource"
		});
	});

	it("should handle ClientError with default code and message", async () => {
		app.get(
			"/",
			(_1: Request, _2: Response, next: NextFunction) => {
				const error = new ClientError(undefined, 400);
				return next(error);
			},
			errorHandler
		);

		const response = await request(app).get("/");

		expect(response.status).toBe(400);
		expect(response.body).toEqual({
			status: "error",
			message:
				"Something went wrong, make sure user is sending the correct input values, params, etc."
		});
	});

	it("should handle ClientError with custom code and message", async () => {
		app.get(
			"/",
			(_1: Request, _2: Response, next: NextFunction) => {
				const error = new ClientError("Custom client error message!", 404);
				return next(error);
			},
			errorHandler
		);

		const response = await request(app).get("/");

		expect(response.status).toBe(404);
		expect(response.body).toEqual({
			status: "error",
			message: "Custom client error message!"
		});
	});

	it("should handle ServerError correctly", async () => {
		app.get(
			"/",
			(_1: Request, _2: Response, next: NextFunction) => {
				const error = new ServerError(undefined, 502);
				return next(error);
			},
			errorHandler
		);

		const response = await request(app).get("/");

		expect(response.status).toBe(502);
		expect(response.body).toEqual({
			status: "error",
			message:
				"An error occured on our server, please try again later. If error persists, please contact us for more information."
		});
	});

	it("should treat other errors as server error", async () => {
		app.get(
			"/",
			(_1: Request, _2: Response, next: NextFunction) => {
				const error = new Error("Javascript error!");
				return next(error);
			},
			errorHandler
		);

		const response = await request(app).get("/");

		expect(response.status).toBe(500);
		expect(response.body).toEqual({
			status: "error",
			message:
				"An error occured on our server, please try again later. If error persists, please contact us for more information."
		});
	});
});
