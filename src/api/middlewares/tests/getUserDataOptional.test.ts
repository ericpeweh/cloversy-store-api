// Mocks
const mockErrorBody = {
	status: "error",
	message:
		"An error occured on our server, please try again later. If error persists, please contact us for more information."
};

const mockUserData = {
	id: 1,
	full_name: "user1",
	email: "user1@example.com"
};

jest.mock("../../services", () => ({
	userService: {
		getUserDataBySub: jest.fn(() => Promise.resolve(mockUserData))
	}
}));

const _responseSender = (req: Request, res: Response) => {
	res.status(200).json({ user: req.user });
};

// Dependencies
import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import getUserDataOptional from "../getUserDataOptional";
import { userService } from "../../services";
import errorHandler from "../errorHandler";

const app = express();

describe("getUserDataOptional", () => {
	afterEach(() => {
		jest.clearAllMocks();

		// Clear route "/" after each test run
		app._router.stack = app._router.stack.filter(
			(middleware: { route: { path: string } }) => middleware.route?.path !== "/"
		);
	});

	it("should continue if there is no authenticated user", async () => {
		// Setup route with getUserDataOptional
		app.get(
			"/",
			// Middleware to mimic no authenticated user
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = undefined;
				next();
			},
			getUserDataOptional,
			_responseSender,
			errorHandler
		);

		// Send get request
		const response = await request(app).get("/");

		// Assert response to be undefined user
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ user: undefined });
	});

	it("should assign user object to req.user", async () => {
		// Assign route to app
		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = { sub: "123" };
				next();
			},
			getUserDataOptional,
			_responseSender
		);

		const response = await request(app).get("/");

		expect(userService.getUserDataBySub).toHaveBeenCalledTimes(1);
		expect(userService.getUserDataBySub).toHaveBeenCalledWith("123");

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ user: mockUserData });
	});

	it("should return server error if getUserDataBySub throws error", async () => {
		// Assign route to app
		app.get(
			"/",
			(req: Request, _: Response, next: NextFunction) => {
				req.auth = { sub: "123" };
				next();
			},
			getUserDataOptional,
			_responseSender,
			errorHandler
		);

		// Mock getUserDataBySub to throw an Error
		(userService.getUserDataBySub as jest.Mock).mockImplementation(() => {
			throw new Error("Database Error!");
		});

		// Make get request
		const response = await request(app).get("/");

		// Assert status & body to match server error
		expect(response.status).toBe(500);
		expect(response.body).toEqual(mockErrorBody);
	});
});
